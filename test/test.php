<?php

require_once __DIR__ . '/../Parser.php';

function test($title, $specs) {
    $errors = [];
    $count = 0;
    $parser = new \HyperDown\Parser();

    echo "\n  ${title}\n";

    foreach ($specs as $key => $rows) {
        echo "    ${key}\n";

        foreach ($rows as $k => $v) {
            list ($text, $html) = $v;

            $markdown = $parser->makeHtml($text);

            if ($html == $markdown) {
                echo "      ✓ ${k}\n";
            } else {
                $num = count($errors) + 1;
                echo "      ${num}) ${k}\n";
                $errors[] = [$key . ' ' . $k, $markdown, $html];
            }

            $count ++;
        }
    }

    echo "\n  " . ($count - count($errors)) . " passing\n";
    echo "  " . count($errors) . " falling\n\n";

    foreach ($errors as $k => $error) {
        list ($key, $markdown, $html) = $error;

        echo '  ' . ($k + 1) . ') ' . $title . " {$key}:\n";
        echo '    ' . $html;
        echo "\n    ==============\n";
        echo '    ' . $markdown;
        echo "\n";
    }
}

test('HyperDown', [
    'footnote'  =>  [
        '脚注' => [
            "Never write \"[click here][^2]\".\n [^2]: http://www.w3.org/QA/Tips/noClickHere",
            '<p>Never write "[click here]<sup id="fnref-1"><a href="#fn-1" class="footnote-ref">1</a></sup>".</p><div class="footnotes"><hr><ol><li id="fn-1">2 <a href="#fnref-1" class="footnote-backref">&#8617;</a></li></ol></div>'
        ]
    ],
    'heading type1' => [
        '#heading#' => [
            '#heading#',
            '<h1>heading</h1>'
        ],
        '######heading######'  => [
            '######heading######',
            '<h6>heading</h6>'
        ]
    ],
    'heading type2' => [
        'heading ======' => [
            "heading\n======",
            '<h1>heading</h1>'
        ]
    ],
    'bold' => [
        '**bold**'  => [
            '123**bold**123',
            '<p>123<strong>bold</strong>123</p>'
        ]
    ],
    'italy' => [
        '*italy*'   => [
            '123 *italy* 123',
            '<p>123 <em>italy</em> 123</p>'
        ]
    ],
    'list'  =>  [
        'ul'    => [
            "\n\n - list",
            '<ul><li>list</li></ul>'
        ],
        'ol'    => [
            '1. list',
            '<ol><li>list</li></ol>'
        ],
        'mix'   => [
            "1. list 1\n2. list 2\n * aaa\n * bbb\n3. list 3\n- dddd\n- cccc",
            ''
        ]
    ],
    'bugfix' => [
        'escape' => [
            "\\[系统盘]:\\Documents and Settings\\\\[用户名]\\\\Cookies$\\lambda$",
            "<p>[系统盘]:\\Documents and Settings\\[用户名]\\Cookies$\\lambda$</p>"
        ],

        'table'  => [
            "|---------------|-------|\n| Variable_name | Value |\n| ------------- | ----- |\n| sql_mode      | ONLY_FULL_GROUP_BY, STRICT_TRANS_TABLES, NO_ZERO_IN_DATE, NO_ZERO_DATE, ERROR_FOR_DIVISION_BY_ZERO, NO_AUTO_CREATE_USER, NO_ENGINE_SUBSTITUTION |\n|---------------|-------|",
            '<table><thead><tr><th>Variable_name</th><th>Value</th></tr></thead><tbody><tr><td>sql_mode</td><td>ONLY_FULL_GROUP_BY, STRICT_TRANS_TABLES, NO_ZERO_IN_DATE, NO_ZERO_DATE, ERROR_FOR_DIVISION_BY_ZERO, NO_AUTO_CREATE_USER, NO_ENGINE_SUBSTITUTION</td></tr></tbody></table>'
        ]
    ],
    'url'=>[
        'exclamatory'=>[ // 感叹号
            'http://sqlfiddle.com/#!9/ca126b/1中文 break',
            '<p><a href="http://sqlfiddle.com/#!9/ca126b/1中文">http://sqlfiddle.com/#!9/ca126b/1中文</a> break</p>'
        ]
    ]
]);

