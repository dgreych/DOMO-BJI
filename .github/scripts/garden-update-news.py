#!/usr/bin/env python3
"""Refresh the public Garden news edition from sourced RSS headlines."""
import json
import sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse
from xml.etree import ElementTree

feeds = [
    'https://news.google.com/rss/search?q=Bj%C3%B6rk+music&hl=pt-BR&gl=BR&ceid=BR:pt-419',
    'https://news.google.com/rss/search?q=Bjork+music&hl=en-US&gl=US&ceid=US:en',
]
items = []
seen = set()
for feed in feeds:
    try:
        request = Request(feed, headers={'User-Agent': 'Mozilla/5.0 GardenNews/1.0'})
        with urlopen(request, timeout=20) as response:
            body = response.read(1_500_001)
        if len(body) > 1_500_000:
            raise ValueError('RSS feed too large')
        for element in ElementTree.fromstring(body).findall('.//channel/item'):
            title = (element.findtext('title') or '').strip()
            url = (element.findtext('link') or '').strip()
            published = (element.findtext('pubDate') or '').strip()
            source = element.findtext('source') or urlparse(url).hostname or 'Fonte externa'
            if not title or not url.startswith('https://') or title in seen:
                continue
            date = parsedate_to_datetime(published)
            if date.tzinfo is None:
                date = date.replace(tzinfo=timezone.utc)
            seen.add(title)
            items.append({'title': title[:350], 'url': url, 'source': source,
                          'publishedAt': date.astimezone(timezone.utc).isoformat().replace('+00:00', 'Z')})
    except Exception as exc:
        print(f'RSS source unavailable: {exc}', file=sys.stderr)
if not items:
    raise SystemExit('No sourced news; preserve the previous deployed edition.')
items.sort(key=lambda item: item['publishedAt'], reverse=True)
path = Path('garden/data/news.json')
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps({'available': True, 'checkedAt': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
                            'items': items[:12]}, ensure_ascii=False, indent=2) + '\n')
print(f'Updated {len(items[:12])} sourced Björk headlines.')
