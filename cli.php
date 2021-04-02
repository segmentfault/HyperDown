<?php

$read = false;
$html = false;
$line = false;
$file = null;

foreach ($argv as $val) {
    if ($val == '-h') {
        $html = true;
        continue;
    } elseif ($val == '-l') {
        $line = true;
        continue;
    }

    if ($read) {
        $file = $val;
        $read = false;
    } elseif ($val == '-f') {
        $read = true;
    }
}

if (empty($file)) {
    exit(1);
}

require_once __DIR__ . '/Parser.php';

$parser = new \HyperDown\Parser();

if ($html) {
    $parser->enableHtml(true);
}

if ($line) {
    $parser->enableLine(true);
}

$buff = file_get_contents($file);
echo $parser->makeHtml($buff);