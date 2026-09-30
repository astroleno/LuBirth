#!/usr/bin/env python3
"""Add only LuBirth Resource Timing visibility; never alter CORS, ACL or origins.

Reads existing ResponseHeader settings for the two approved CDN hosts, preserves
their rules and appends one directory-scoped Timing-Allow-Origin rule. Secrets
stay in this process. Default is a read-only plan; --apply performs the update.
"""
import argparse
import copy
import datetime
import hashlib
import hmac
import importlib.util
import json
from pathlib import Path
import time
import urllib.error
import urllib.request

DOMAINS = ("assets.aitoshuu.me", "media.aitoshuu.me")
RULE = {"Mode": "set", "HeaderName": "Timing-Allow-Origin",
        "HeaderValue": "https://aitoshuu.me", "RuleType": "directory",
        "RulePaths": ["/releases/aitoshuu-me/"]}


def credentials():
    spec = importlib.util.spec_from_file_location("cos_wrapper", Path(__file__).with_name("upload-cos-release.py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.keychain("secret-id"), module.keychain("secret-key")


def request(action, body, keys):
    if action not in ("DescribeDomainsConfig", "UpdateDomainConfig"):
        raise RuntimeError("Action outside header configuration scope")
    if action == "UpdateDomainConfig" and (set(body) != {"Domain", "ResponseHeader"} or body["Domain"] not in DOMAINS):
        raise RuntimeError("Update outside approved hosts/header scope")
    host = "cdn.tencentcloudapi.com"
    payload = json.dumps(body, separators=(",", ":")).encode()
    stamp = int(time.time())
    date = datetime.datetime.fromtimestamp(stamp, datetime.timezone.utc).strftime("%Y-%m-%d")
    scope = f"{date}/cdn/tc3_request"
    headers = f"content-type:application/json; charset=utf-8\nhost:{host}\n"
    canonical = f"POST\n/\n\n{headers}\ncontent-type;host\n{hashlib.sha256(payload).hexdigest()}"
    message = f"TC3-HMAC-SHA256\n{stamp}\n{scope}\n{hashlib.sha256(canonical.encode()).hexdigest()}"
    sign = lambda key, value: hmac.new(key, value.encode(), hashlib.sha256).digest()
    signing = sign(sign(sign(("TC3" + keys[1]).encode(), date), "cdn"), "tc3_request")
    signature = hmac.new(signing, message.encode(), hashlib.sha256).hexdigest()
    authorization = f"TC3-HMAC-SHA256 Credential={keys[0]}/{scope}, SignedHeaders=content-type;host, Signature={signature}"
    req = urllib.request.Request(f"https://{host}/", data=payload, headers={
        "Content-Type": "application/json; charset=utf-8", "Host": host,
        "X-TC-Action": action, "X-TC-Version": "2018-06-06", "X-TC-Timestamp": str(stamp),
        "Authorization": authorization,
    })
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            result = json.load(response)["Response"]
    except (urllib.error.URLError, ValueError, KeyError):
        raise RuntimeError("CDN API transport/response failed") from None
    if "Error" in result:
        # API error messages may include signed data; expose only the error code.
        raise RuntimeError(f"CDN API: {result['Error'].get('Code', 'UnknownError')}")
    return result


def read_headers(domain, keys):
    result = request("DescribeDomainsConfig", {"Filters": [{"Name": "domain", "Value": [domain]}], "Limit": 10}, keys)
    matches = [item for item in result.get("Domains", []) if item.get("Domain") == domain]
    if len(matches) != 1:
        raise RuntimeError("Requested CDN domain not found exactly once")
    return matches[0].get("ResponseHeader") or {"Switch": "off", "HeaderRules": []}


def updated_headers(before):
    after = copy.deepcopy(before)
    rules = after.get("HeaderRules") or []
    if before.get("Switch") != "on" and rules:
        raise RuntimeError("Disabled existing header rules need separate review before enabling")
    if RULE not in rules:
        rules.append(copy.deepcopy(RULE))
    after.update(Switch="on", HeaderRules=rules)
    return after


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    keys = credentials()
    for domain in DOMAINS:
        before = read_headers(domain, keys)
        after = updated_headers(before)
        changed = before != after
        if args.apply and changed:
            request("UpdateDomainConfig", {"Domain": domain, "ResponseHeader": after}, keys)
        print(json.dumps({"domain": domain, "mode": "applied" if args.apply else "plan",
                          "changed": changed, "preservedRules": len(before.get("HeaderRules") or []), "rule": RULE}))


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as error:
        raise SystemExit(str(error)) from None
