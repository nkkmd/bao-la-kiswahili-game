"""生成ページのリンク・図版・収録範囲を検証する。"""
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
from bs4 import BeautifulSoup
import re
ROOT=Path(__file__).resolve().parents[2]
PUBLIC=ROOT/'public'
ORIGIN='https://bao.test'
pages={'/rules':'rules.html','/rules/complete':'rules/complete.html'}
documents={url:BeautifulSoup((PUBLIC/file).read_text(encoding='utf-8'),'html.parser') for url,file in pages.items()}
checks=0
for url,doc in documents.items():
    ids=[n['id'] for n in doc.select('[id]')]
    assert len(ids)==len(set(ids)), 'IDの重複: '+url
    assert len(doc.find_all('h1'))==1
    for node in doc.select('a[href],img[src],script[src],link[href]'):
        attr='src' if node.has_attr('src') else 'href'
        destination=urlsplit(urljoin(ORIGIN+url,node[attr]))
        if destination.netloc!='bao.test': continue
        path=unquote(destination.path)
        if path in pages and destination.fragment:
            assert documents[path].find(id=unquote(destination.fragment)), (url,node[attr])
        if path not in pages:
            resource=PUBLIC/('index.html' if path=='/' else path.lstrip('/'))
            if not resource.exists(): resource=resource.with_suffix('.html')
            assert resource.is_file(), (url,node[attr])
        checks+=1
    for image in doc.select('figure img'):
        assert image.get('alt'), '代替テキストのない図'
complete=documents['/rules/complete']
assert len(complete.select('.guide-chapter'))==16
assert len(complete.select('#guide-04-glossary h4'))==40
assert len([h for h in complete.select('#guide-13-faq h4') if re.match(r'Q\d+\.',h.get_text())])==50
assert len([h for h in complete.select('#guide-examples h4') if re.match(r'E\d+:',h.get_text())])==32
for anchor in ['goal','board','setup','sowing','namua','capture','mtaji','nyumba','takasia','controls','rules-used']:
    assert documents['/rules'].find(id=anchor)
assert len(documents['/rules'].get_text()) < len(complete.get_text())/3
print('ページ内・ページ間リンクと資産: '+str(checks)+'件、全16章・用語40項目・FAQ50問・局面32例: PASS')
