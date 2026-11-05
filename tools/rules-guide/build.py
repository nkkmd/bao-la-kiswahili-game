"""固定した日本語ガイドから詳細ページを生成する。ネットワーク接続は不要。"""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import posixpath, re, unicodedata, json, hashlib, argparse, shutil
import markdown
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
SOURCE=HERE/'source'
REVISION='aad9fda3ffb12c2ca785509951c71ce8a42bef5a'
UPSTREAM='https://github.com/nkkmd/bao-la-kiswahili-ja/blob/'+REVISION+'/'
def slug(value, separator='-'):
    value=re.sub(r'<[^>]*>','',value).strip().lower()
    return ''.join(c for c in value if c in '_- ' or unicodedata.category(c)[0] in 'LN').replace(' ',separator)

def build():
    paths=sorted((SOURCE/'guide').glob('[0-9][0-9]-*.md'))
    paths += [SOURCE/'guide/examples/README.md',SOURCE/'guide/examples/validation-cases.md']
    chapters={}
    for index,path in enumerate(paths):
        md=markdown.Markdown(extensions=['tables','fenced_code','toc'],extension_configs={'toc':{'slugify':slug}})
        document=BeautifulSoup(md.convert(path.read_text(encoding='utf-8')),'html.parser')
        key=path.relative_to(SOURCE).as_posix()
        prefix='guide-'+(path.stem if path.name!='README.md' else 'examples')
        if key.endswith('validation-cases.md'): prefix='guide-validation-cases'
        anchors={}
        for heading in document.find_all(re.compile('^h[1-6]$')):
            old=heading.get('id',slug(heading.get_text()))
            # Python-Markdown uses _1 for duplicate headings; GitHub uses -1.
            github=re.sub(r'_(\d+)$',r'-\1',old)
            heading['id']=prefix+'--'+github
            anchors[github]=heading['id']
            heading.name='h'+str(min(6,int(heading.name[1])+1))
        chapters[key]={'prefix':prefix,'document':document,'anchors':anchors,'title':document.h2.get_text()}
    for key,item in chapters.items():
        doc=item['document']
        for node in doc.select('[href], [src]'):
            attr='href' if node.has_attr('href') else 'src'
            value=node[attr]; url=urlsplit(value)
            if url.scheme or url.netloc: continue
            target=posixpath.normpath(posixpath.join(posixpath.dirname(key),unquote(url.path))) if url.path else key
            fragment=unquote(url.fragment)
            if target in chapters:
                target_item=chapters[target]
                if fragment:
                    if fragment not in target_item['anchors']: raise ValueError('参照先の見出しがない: '+key+' '+value)
                    node[attr]='#'+target_item['anchors'][fragment]
                else: node[attr]='#'+target_item['prefix']
            elif target=='guide/README.md':
                node[attr]='#reference-contents'
            elif target.startswith('assets/images/') and attr=='src':
                node[attr]='../assets/complete-guide/'+posixpath.basename(target)
            else:
                node[attr]=UPSTREAM+target+('#'+url.fragment if url.fragment else '')
        for image in list(doc.find_all('img')):
            image['loading']='lazy'; image['decoding']='async'
            if image.parent.name=='p' and len(image.parent.contents)==1: image.parent.unwrap()
            figure=doc.new_tag('figure'); image.replace_with(figure); figure.append(image)
            caption=doc.new_tag('figcaption'); caption.string=image.get('alt',''); figure.append(caption)
            zoom=doc.new_tag('a',href=image['src'],attrs={'class':'figure-zoom','target':'_blank','rel':'noopener noreferrer'}); zoom.string='図を拡大 ↗'; figure.append(zoom)
        for table in doc.find_all('table'):
            wrap=doc.new_tag('div',attrs={'class':'guide-table','tabindex':'0','role':'region','aria-label':'横にスクロールできる表'}); table.wrap(wrap)
    soup=BeautifulSoup((HERE/'template.html').read_text(encoding='utf-8'),'html.parser')
    for base in soup.find_all('base'): base.decompose()
    for node in soup.select('[href], [src]'):
        for attr in ['href','src']:
            if node.get(attr,'').startswith('./'): node[attr]='../'+node[attr][2:]
    reference=soup.new_tag('article',id='reference',lang='ja',attrs={'aria-labelledby':'reference-title'})
    heading=soup.new_tag('h2',id='reference-title'); heading.string='日本語完全ガイド：本文と補助教材'; reference.append(heading)
    p=soup.new_tag('p'); p.string='以下は v0.2.0 の日本語本文です。英語表示を選んでも、この部分は日本語で掲載します。第11章は構成案です。図解部分に、このゲームの採用範囲と実装上の差異を記載しています。'; reference.append(p)
    nav=soup.new_tag('nav',id='reference-contents',attrs={'class':'rules-toc','aria-label':'日本語完全ガイドの目次'})
    ol=soup.new_tag('ol'); nav.append(ol)
    for item in chapters.values():
        li=soup.new_tag('li'); a=soup.new_tag('a',href='#'+item['prefix']); a.string=item['title']; li.append(a); ol.append(li)
        section=soup.new_tag('section',id=item['prefix'],attrs={'class':'rules-section guide-chapter'})
        section.append(item['document'])
        back=soup.new_tag('a',href='#reference-contents',attrs={'class':'back-to-top'}); back.string='日本語本文の目次へ戻る ↑'; section.append(back)
        reference.append(section)
    reference.insert(2,nav)
    credit=soup.new_tag('p'); credit.append(BeautifulSoup('出典：bao-la-kiswahili-ja contributors（2026）「Bao la Kiswahili 日本語完全ガイド」v0.2.0。本文は固定版から収録し、HTML化・リンク変換・見出し階層の調整を行いました。文章と自作図版は <a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>。外部資料には適用されません。','html.parser')); reference.insert(2,credit)
    soup.select_one('#complete-reference-placeholder').replace_with(reference)
    li=soup.new_tag('li'); a=soup.new_tag('a',href='#reference-contents',attrs={'data-ja':'日本語完全ガイドの本文・用語・FAQ・局面例'}); a.string='Full Japanese guide, glossary, FAQ and examples'; li.append(a); soup.select_one('.rules-toc ol').append(li)
    return str(soup)+'\n'

if __name__=='__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('--check',action='store_true'); args=parser.parse_args()
    expected=build(); output=ROOT/'public/rules/complete.html'
    manifest=json.loads((HERE/'source-manifest.json').read_text(encoding='utf-8'))
    assert manifest['revision']==REVISION
    assert set(manifest['files'])=={p.relative_to(SOURCE).as_posix() for p in SOURCE.rglob('*') if p.is_file()}
    for name,digest in manifest['files'].items():
        assert hashlib.sha256((SOURCE/name).read_bytes()).hexdigest()==digest, '固定原稿の変更: '+name
    for image in (SOURCE/'assets/images').glob('*.svg'):
        destination=ROOT/'public/assets/complete-guide'/image.name
        if args.check: assert destination.read_bytes()==image.read_bytes(), image.name
        else: shutil.copyfile(image,destination)
    if args.check:
        assert output.read_text(encoding='utf-8')==expected, '詳細ページを再生成してください'
    else:
        output.parent.mkdir(parents=True,exist_ok=True); output.write_text(expected,encoding='utf-8',newline='\n')
    print('詳細ルールガイド: 検証完了')
