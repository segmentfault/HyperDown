为何要写这样一个解析器
======================

Markdown已经面世许多年了，国内外许多大大小小的网站都在用它，但是它的解析器却依然混乱不堪。SegmentFault 是中国较大规模使用 Markdown 语法的网站，我们一直在使用一些开源类库，包括但不限于

1. [php-markdown](https://github.com/michelf/php-markdown)
2. [CommonMark for PHP](https://github.com/thephpleague/commonmark)
3. [Parsedown](https://github.com/erusev/parsedown)

他们都有或多或少的毛病，有的性能较差，有的代码比较业余，更多的情况是由于Markdown本身解析比较复杂，因此我们几乎无法去维护另外一个人写的代码。基于这个原因，我为 SegmentFault 专门编写了这么一个Markdown解析器。

使用方法
--------

与常规的解析类库没有任何区别

```php
$parser = new HyperDown\Parser;
$html = $parser->makeHtml($text);
```

当前支持的语法
--------------

- 标题
- 列表（可递归）
- 引用（可递归）
- 缩进风格的代码块
- Github风格的代码块
- 各种行内文字加粗，斜体等效果
- 链接，图片
- 自动链接
- 段内折行
- 脚标
- 分隔符
- 表格
- 图片和链接支持互相套用

浏览器中使用请参阅 [HyperDown.js](https://github.com/SegmentFault/HyperDown.js)
