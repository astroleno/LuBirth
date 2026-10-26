# Canonical app path is case-sensitive; old spellings keep working via 308.
# Include inside the aitoshuu.me HTTPS server, before generic file locations.
location = /LuBirth {
    return 308 https://aitoshuu.me/LuBirth/$is_args$args;
}

location = /LuBirth/release-health.json {
    alias /www/wwwroot/lubirth-current/release-health.json;
    set $fv_cache_control "no-store";
}

location ^~ /LuBirth/ {
    alias /www/wwwroot/lubirth-current/;
    index index.html;
    try_files $uri $uri/ =404;
    set $fv_cache_control "no-cache";
}

location ~* ^/lubirth$ {
    return 308 https://aitoshuu.me/LuBirth/$is_args$args;
}

location ~* ^/lubirth/(?<lubirth_redirect_suffix>.*)$ {
    return 308 https://aitoshuu.me/LuBirth/$lubirth_redirect_suffix$is_args$args;
}
