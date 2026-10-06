#!/usr/bin/env python3
import sys
import os
import base64
import hashlib
import datetime
import random
import requests

HATENA_ID = "MyToyotaHomeBottle"
API_KEY = "q9erge7pu6"
BLOG_DOMAIN = "naogoya-aichi-koukoujyuken.hatenadiary.com"
ENDPOINT = f"https://blog.hatena.ne.jp/{HATENA_ID}/{BLOG_DOMAIN}/atom/entry"

def generate_wsse(username, key):
    created = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    nonce = hashlib.sha1(str(random.random()).encode("utf-8")).digest()
    digest = hashlib.sha1(nonce + created.encode("utf-8") + key.encode("utf-8")).digest()
    return (
        f'UsernameToken Username="{username}", '
        f'PasswordDigest="{base64.b64encode(digest).decode("utf-8")}", '
        f'Nonce="{base64.b64encode(nonce).decode("utf-8")}", '
        f'Created="{created}"'
    )

def post_article(title, html_content, categories, is_draft=False, updated_time=None):
    categories_xml = "\n".join([f'  <category term="{cat}" />' for cat in categories])
    draft_val = "yes" if is_draft else "no"
    
    updated_xml = f"  <updated>{updated_time}</updated>\n" if updated_time else ""

    xml_data = f"""<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom"
       xmlns:app="http://www.w3.org/2007/app">
  <title>{title}</title>
  <author><name>{HATENA_ID}</name></author>
{updated_xml}  <content type="text/html">
<![CDATA[
{html_content}
]]>
  </content>
{categories_xml}
  <app:control>
    <app:draft>{draft_val}</app:draft>
  </app:control>
</entry>
"""

    headers = {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "X-WSSE": generate_wsse(HATENA_ID, API_KEY),
    }

    res = requests.post(ENDPOINT, data=xml_data.encode("utf-8"), headers=headers)
    print(f"[{res.status_code}] Posted: {title}")
    if res.status_code not in (200, 201):
        print("Error detail:", res.text[:400])
    return res

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 hatena_publisher.py <title> <html_file> [cat1,cat2...]")
        sys.exit(1)
    
    t = sys.argv[1]
    fpath = sys.argv[2]
    cats = sys.argv[3].split(",") if len(sys.argv) > 3 else ["高校受験"]
    
    with open(fpath, "r", encoding="utf-8") as f:
        html = f.read()
    
    post_article(t, html, cats)
