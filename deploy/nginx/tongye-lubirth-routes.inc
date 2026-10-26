# Canonical LuBirth navigation: update the browser address bar and preserve links.
# Include inside the tongye.me HTTPS server, before generic file locations.
location ~* ^/lubirth$ {
    return 308 https://aitoshuu.me/LuBirth/$is_args$args;
}

location ~* ^/lubirth/(?<lubirth_redirect_suffix>.*)$ {
    return 308 https://aitoshuu.me/LuBirth/$lubirth_redirect_suffix$is_args$args;
}
