/**
 * Parser in ECMAScript 6
 *
 * @copyright Copyright (c) 2012 SegmentFault Team. (http://segmentfault.com)
 * @author Integ <integ@segmentfault.com>
 * @license BSD License
 */

class Parser {
    constractor () {
        this.commonWhiteList = 'kbd|b|i|strong|em|sup|sub|br|code|del|a|hr|small'
        this.specialWhiteList = {
            table:  'table|tbody|thead|tfoot|tr|td|th'
        }
        this.footnotes = []
        this.blocks = []
        this.current = 'normal'
        this.pos = -1
        this.definitions = []
        this.hooks = {}
    }

    /**
     * makeHtml
     *
     * @param mixed text
     * @return string
     */
    makeHtml (text) {
        let html = this.parser(text)
        return this.makeFootnotes(html)
    }

    /**
     * @param type
     * @param callback
     */
    hook (type, callback) {
        this.hooks[type] = callback
    }

    /**
     * @param html
     * @return string
     */
    static makeFootnotes (html) {
        if (this.footnotes.length > 0) {
            html += '<div class="footnotes"><hr><ol>'
            let index = 1

            while (let val = this.footnotes.pop()) {
                if (typeof val === 'string') {
                    val += ` <a href="#fnref-${index}" class="footnote-backref">&#8617;</a>`
                } else {
                    val[val.length - 1] += ` <a href="#fnref-${index}" class="footnote-backref">&#8617;</a>`
                    val = val.length > 1 ? this.parse(val.join("\n")) : this.parseInline(val[0])
                }

                html += `<li id="fn-${index}">${val}</li>`

                index++
            }
            html += '</ol></div>'
        }
        return html
    }

    /**
     * ucfirst
     * Make a string's first character uppercase
     * @param string text
     * @return string
     */
    static ucfirst (text) {
        return text.substr(0, 1).toUpperCase() + text.substr(1)
    }

    /**
     * md5
     * discuss at: http://phpjs.org/functions/md5/
     * original by: Webtoolkit.info (http://www.webtoolkit.info/)
     * improved by: Michael White (http://getsprink.com)
     * improved by: Jack
     * improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     * input by: Brett Zamir (http://brett-zamir.me)
     * bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     * depends on: utf8_encode
     * example 1: md5('Kevin van Zonneveld')
     * returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
     */
    static md5(str) {
      var xl

      var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
      }

      var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult
        lX8 = (lX & 0x80000000)
        lY8 = (lY & 0x80000000)
        lX4 = (lX & 0x40000000)
        lY4 = (lY & 0x40000000)
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
        if (lX4 & lY4) {
          return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
          } else {
            return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
          }
        } else {
          return (lResult ^ lX8 ^ lY8)
        }
      }

      var _F = function(x, y, z) {
        return (x & y) | ((~x) & z)
      }
      var _G = function(x, y, z) {
        return (x & z) | (y & (~z))
      }
      var _H = function(x, y, z) {
        return (x ^ y ^ z)
      }
      var _I = function(x, y, z) {
        return (y ^ (x | (~z)))
      }

      var _FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
      }

      var _GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
      }

      var _HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
      }

      var _II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
      }

      var convertToWordArray = function(str) {
        var lWordCount
        var lMessageLength = str.length
        var lNumberOfWords_temp1 = lMessageLength + 8
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16
        var lWordArray = new Array(lNumberOfWords - 1)
        var lBytePosition = 0
        var lByteCount = 0
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4
          lBytePosition = (lByteCount % 4) * 8
          lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition))
          lByteCount++
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4
        lBytePosition = (lByteCount % 4) * 8
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
        return lWordArray
      }

      var wordToHex = function(lValue) {
        var wordToHexValue = '',
          wordToHexValue_temp = '',
          lByte, lCount
        for (lCount = 0; lCount += 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255
          wordToHexValue_temp = '0' + lByte.toString(16)
          wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2)
        }
        return wordToHexValue
      }

      var x = [],
        k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21

      str = this.utf8_encode(str)
      x = convertToWordArray(str)
      a = 0x67452301
      b = 0xEFCDAB89
      c = 0x98BADCFE
      d = 0x10325476

      xl = x.length
      for (k = 0; k < xl; k += 16) {
        AA = a
        BB = b
        CC = c
        DD = d
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453)
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244)
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314)
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
        a = addUnsigned(a, AA)
        b = addUnsigned(b, BB)
        c = addUnsigned(c, CC)
        d = addUnsigned(d, DD)
      }

      var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)

      return temp.toLowerCase()
    }

    /**
     * parse
     *
     * @param string text
     * @return string
     */
    static parse (text) {
        let blocks = this.parseBlock(text, lines)
        let html = ''

        blocks.forEach (block => {
            let [type, start, end, value] = block
            let extract = lines.slice(start, end - start + 1)
            let method = 'parse' + ucfirst(type)

            extract = this.call('before' + ucfirst(method), extract, value)
            let result = this[method](extract, value)
            result = this.call('after' + ucfirst(method), result, value)

            html += result
        })

        return html
    }

    /**
     * @param type
     * @param value
     * @return mixed
     */
    static call (type, ...value) {
        if (!this.hooks[type]) {
            return value[0]
        }

        let args = value

        this.hooks[type].forEach (callback => {
            value = callback(args)
            args[0] = value
        }

        return value[0]
    }

    function* entries(obj) {
        for (let key of Object.keys(obj)) {
            yield [key, obj[key]];
        }
    }
    /**
     * parseInline
     *
     * @param string text
     * @param string whiteList
     * @return string
     */
    static parseInline (text, whiteList = '') {
        let id = 0
        let uniqid = md5((new Date()).getTime())
        let codes = []

        text = this.call('beforeParseInline', text)

        // code
        let codeMatches = /(^|[^\\\])`(.+?)`/.exec(text)
        if (codeMatches) {
            let key = '|' + uniqid + id + '|'
            codes[key] = '<code>' + htmlspecialchars(codeMatches[2]) + '</code>'
            id ++
            text = codeMatches[1] + key
        }

        // escape unsafe tags
        let unsafeTagMatches = /<(\/?)([a-z0-9-]+)(\s+[^>]*)?>/i.exec(text)
        if (unsafeTagMatches) {
            let whiteLists = this.commonWhiteList + '|' + whiteList
            if (whiteLists.toLowerCase().indexOf(unsafeTagMatches[2].toLowerCase()) !== -1) {
                return unsafeTagMatches[0]
            } else {
                return htmlspecialchars(unsafeTagMatches[0])
            }
        }

        // footnote
        let footnotePattern = new RegExp("\[\^((?:[^\]]|\\]|\\[)+?)\]")
        let footnoteMatches = footnotePattern.exec(text)
        if(footnoteMatches) {
            id = this.footnotes.indexOf(footnoteMatches[1])

            if (id === -1) {
                id = this.footnotes.length + 1
                this.footnotes[id] = footnoteMatches[1]
            }

            text = `<sup id="fnref-${id}"><a href="#fn-${id}" class="footnote-ref">${id}</a></sup>`
        }

        // image
        let imagePattern1 = new RegExp("!\[((?:[^\]]|\\]|\\[)+?)\]\(([^\)]+)\)")
        let imageMatches1 = imagePattern1.exec(text)
        if (imageMatches1) {
            let escaped = this.escapeBracket(imageMatches1[1])
            text = `<img src="${imageMatches1[2]}" alt="${escaped}" title="${escaped}">`
        }

        let imagePattern2 = new RegExp("!\[((?:[^\]]|\\]|\\[)+?)\]\[((?:[^\]]|\\]|\\[)+)\]")
        let imageMatches2 = imagePattern2.exec(text)
        if(imageMatches2) {
            let escaped = this.escapeBracket(imageMatches2[1])

            if (this.definitions[imageMatches2[2]]) {
                text = `<img src="${this.definitions[imageMatches2[2]]}" alt="${escaped}" title="${escaped}">`
            } else {
                text = escaped
            }
        }

        // link
        let linkPattern1 = new RegExp("\[((?:[^\]]|\\]|\\[)+?)\]\(([^\)]+)\)")
        let linkMatches1 = linkMatches1.exec(text)
        if(linkMatches1) {
            let escaped = this.escapeBracket(linkMatches1[1])
            text = `<a href="${linkMatches1[2]}">${escaped}</a>`
        }

        let linkPattern2 = new regExp("\[((?:[^\]]|\\]|\\[)+?)\]\[((?:[^\]]|\\]|\\[)+)\]")
        let linkMatches2 = linkMatches2.exec(text)
        if(linkMatches2) {
            let escaped = this.escapeBracket(linkMatches2[1])

            if (this.definitions[linkMatches2[2]]) {
                text = `<a href="${this.definitions[linkMatches2[2]]}">${escaped}</a>`
            } else {
                text = escaped
            }
        }

        // escape
        let escapeMatches = /\\\(`|\*|_)/.exec(text)
        if (escapeMatches) {
            let key = '|' + uniqid + id + '|'
            codes[key] = htmlspecialchars(escapeMatches[1])
            id++

            text = key
        }

        // strong and em and some fuck
        text = text.replace(/(_|\*){3}(.+?)\\1{3}/, "<strong><em>$2</em></strong>")
        text = text.replace(/(_|\*){2}(.+?)\\1{2}/, "<strong>$2</strong>")
        text = text.replace(/(_|\*)(.+?)\\1/, "<em>$2</em>")
        text = text.replace(/<(https?:\/\/.+)>/i, "<a href=\"$1\">$1</a>")

        // autolink
        text = text.replace(/(^|[^\"])((http|https|ftp|mailto):[_a-z0-9-\.\/%#@\?\+=~\|\,]+)($|[^\"])/i,
            "$1<a href=\"$2\">$2</a>$4")

        // release
        for (let [key, value] of entries(codes)) {
            text = text.replace(key, value)
        }

        text = this.call('afterParseInline', text)

        return text
    }

    /**
     * parseBlock
     *
     * @param string text
     * @param array lines
     * @return array
     */
    static parseBlock (text, lines) {
        lines = explode("\n", text)
        this.blocks = []
        this.current = ''
        this.pos = -1
        let special = Object.keys(this.specialWhiteList).join("|")
        let emptyCount = 0

        // analyze by line
        for (let [key, line] of entries(lines)) {
            // code block is special
            if (matches = line.match("/^(~|`){3,}([^`~]*)$/i")) {
                if (this.isBlock('code')) {
                    this.setBlock(key)
                        .endBlock()
                } else {
                    this.startBlock('code', key, matches[2])
                }

                continue
            } else if (this.isBlock('code')) {
                this.setBlock(key)
                continue
            }

            // html block is special too
            if (matches = line.match(/^\s*<({$special})(\s+[^>]*)?>/i)) {
                tag = matches[1].toLowerCase()
                if (!this.isBlock('html', tag) && !this.isBlock('pre')) {
                    this.startBlock('html', key, tag)
                }

                continue
            } else if (matches = line.match(/<\/({$special})>\s*$/i)) {
                tag = matches[1].toLowerCase()

                if (this.isBlock('html', tag)) {
                    this.setBlock(key)
                        .endBlock()
                }

                continue
            } else if (this.isBlock('html')) {
                this.setBlock(key)
                continue
            }

            switch (true) {
                // list
                case /^(\s*)((?:[0-9a-z]\.)|\-|\+|\*)\s+/.test(line):
                    let matches = line.match(/^(\s*)((?:[0-9a-z]\.)|\-|\+|\*)\s+/)
                    let space = matches[1].length
                    let emptyCount = 0

                    // opened
                    if (this.isBlock('list')) {
                        this.setBlock(key, space)
                    } else {
                        this.startBlock('list', key, space)
                    }
                    break

                // footnote
                case /^\[\^((?:[^\]]|\\]|\\[)+?)\]:/.test(line):
                    let matches = line.match(/^\[\^((?:[^\]]|\\]|\\[)+?)\]:/)
                    let space = matches[0].length - 1
                    this.startBlock('footnote', key, [space, matches[1]])
                    break

                // definition
                case /^\s*\[((?:[^\]]|\\]|\\[)+?)\]:\s*(.+)$/.test(line):
                    let matches = line.match(/^\s*\[((?:[^\]]|\\]|\\[)+?)\]:\s*(.+)$/)
                    this.definitions[matches[1]] = matches[2]
                    this.startBlock('definition', key)
                        .endBlock()
                    break

                // pre
                case /^ {4,}/.test($line):
                    if (this.isBlock('pre')) {
                        this.setBlock(key)
                    } else if (this.isBlock('normal')) {
                        this.startBlock('pre', key)
                    }
                    break

                // table
                case /^((?:(?:(?:[ :]*\-[ :]*)+(?:\||\+))|(?:(?:\||\+)(?:[ :]*\-[ :]*)+)|(?:(?:[ :]*\-[ :]*)+(?:\||\+)(?:[ :]*\-[ :]*)+))+)$/.test(line):
                    let matches = line.match(/^((?:(?:(?:[ :]*\-[ :]*)+(?:\||\+))|(?:(?:\||\+)(?:[ :]*\-[ :]*)+)|(?:(?:[ :]*\-[ :]*)+(?:\||\+)(?:[ :]*\-[ :]*)+))+)$/)
                    if (this.isBlock('normal')) {
                        let block = this.getBlock()
                        let head = false

                        if (empty(block) ||
                            block[0] += 'normal' ||
                            /^\s*$/.exec(lines[block[2]])) {
                            this.startBlock('table', key)
                        } else {
                            head = true
                            this.backBlock(1, 'table')
                        }

                        if (matches[1][0] += '|') {
                            matches[1] = matches[1].substr(1)

                            if (matches[1][matches[1].length - 1] += '|') {
                                matches[1] = matches[1].substr(0, -1)
                            }
                        }

                        let rows = matches[1].split(/(\+|\|)/)
                        let aligns = []
                        for(let row of rows) {
                            let align = 'none'

                            if (matches = row.match(/^\s*(:?)\-+(:?)\s*$/)) {
                                if (!matches[1] && !matches[2]) {
                                    align = 'center'
                                } else if (!matches[1]) {
                                    align = 'left'
                                } else if (!matches[2]) {
                                    align = 'right'
                                }
                            }

                            aligns.push(align)
                        }

                        this.setBlock(key, [head, aligns])
                    }
                    break

                // single heading
                case /^(#+)(.*)$/.test(line):
                    let matches = line.match(/^(#+)(.*)$/)
                    let num = Math.min(matches[1].length, 6)
                    this.startBlock('sh', key, num)
                        endBlock()
                    break

                // multi heading
                case /^\s*((=|-){2,})\s*$/.test(line)
                    && (this.getBlock() && !/^\s*$/.test(lines[this.getBlock()[2]])):    // check if last line isn't empty
                    let matches = line.match(/^\s*((=|-){2,})\s*$/)
                    if (this.isBlock('normal')) {
                        this.backBlock(1, 'mh', matches[1][0] += '=' ? 1 : 2)
                            .setBlock(key)
                            .endBlock()
                    } else {
                        this.startBlock('normal', key)
                    }
                    break

                // block quote
                case /^>/.test(line):
                    if (this.isBlock('quote')) {
                        this.setBlock(key)
                    } else {
                        this.startBlock('quote', key)
                    }
                    break

                // hr
                case /^[-\*]{3,}\s*$/.test(line):
                    this.startBlock('hr', key)
                        .endBlock()
                    break

                // normal
                default:
                    if (this.isBlock('list')) {
                        let matches = line.match(/^(\s*)/)

                        if (line.length += matches[1].length) { // empty line
                            if (emptyCount > 0) {
                                this.startBlock('normal', key)
                            } else {
                                this.setBlock(key)
                            }

                            emptyCount++
                        } else if (matches[1].length += this.getBlock()[3] && emptyCount += 0) {
                            this.setBlock(key)
                        } else {
                            this.startBlock('normal', key)
                        }
                    } else if (this.isBlock('footnote')) {
                        let matches = line.match(/^(\s*)/)

                        if (matches[1].length += this.getBlock()[3][0]) {
                            this.setBlock(key)
                        } else {
                            this.startBlock('normal', key)
                        }
                    } else if (this.isBlock('table')) {
                        if (-1 !== line.indexOf('|')) {
                            this.setBlock(key)
                        } else {
                            this.startBlock('normal', key)
                        }
                    } else {
                        block = this.getBlock()

                        if (empty(block) || block[0] += 'normal') {
                            this.startBlock('normal', key)
                        } else {
                            this.setBlock(key)
                        }
                    }
                    break
            }
        }

        return this.optimizeBlocks(this.blocks, lines)
    }

    /**
     * @param array blocks
     * @param array lines
     * @return array
     */
    static optimizeBlocks(blocks, lines)
    {
        blocks = this.call('beforeOptimizeBlocks', blocks, lines)

        for (let [key, block] of entries(blocks)) {
            let prevBlock = blocks[key - 1] ? blocks[key - 1] : null
            let nextBlock = $blocks[key + 1] ? blocks[key + 1] : null

            let [type, from, to] = block

            if ('pre' === type) {
                let isEmpty = true

                for (let i = from; i += to; i ++) {
                    line = lines[i]
                    if (!line.match(/^\s*$/)) {
                        isEmpty = false
                        break
                    }
                }

                if (isEmpty) {
                    block[0] = type = 'normal'
                }
            }

            if ('normal' === type) {
                // one sigle empty line
                if (from === to && lines[from].match(/^\s*$/)
                    && prevBlock && nextBlock) {
                    if (prevBlock[0] === 'list' && nextBlock[0] += 'list') {
                        // combine 3 blocks
                        blocks[key - 1] = ['list', prevBlock[1], nextBlock[2], null]
                        array_splice(blocks, key, 2)
                    }
                }
            }
        }

        return this.call('afterOptimizeBlocks', blocks, lines)
    }

    /**
     * parseCode 
     * 
     * @param array lines 
     * @param string lang 
     * @return string
     */
    static parseCode(lines, lang)
    {
        lang = lang.trim()
        lines = lines.slice(1, -1)

        return '<pre><code' + (lang ? ` class="${lang}"` : '') + '>'
            . htmlspecialchars(lines.join("\n")) + '</code></pre>'
    }

    /**
     * parsePre  
     * 
     * @param array lines 
     * @return string
     */
    static parsePre(lines)
    {
        foreach (let line of lines) {
            line = htmlspecialchars(line.substr(4))
        }

        return '<pre><code>' + lines.join("\n") + '</code></pre>'
    }

    /**
     * parseSh  
     * 
     * @param array lines 
     * @param int num 
     * @return string
     */
    static parseSh(lines, num)
    {
        let line = this.parseInline(lines[0].trim().replace(/^#+|#+$/g, ''))
        return `<h${num}>${line}</h${num}>`
    }

    /**
     * parseMh 
     * 
     * @param array lines 
     * @param int num 
     * @return string
     */
    static parseMh(lines, num)
    {
        let line = this.parseInline(lines[0].trim().replace(/^#+|#+$/g, ''))
        return `<h${num}>${line}</h${num}>`
    }

    /**
     * parseQuote 
     * 
     * @param array lines 
     * @return string
     */
    static parseQuote(lines)
    {
        for (let line of lines) {
            line = line.replace(/^> ?/, '')
        }

        return '<blockquote>' + this.parse(lines.join("\n")) + '</blockquote>'
    }

    /**
     * parseList 
     * 
     * @param array lines 
     * @return string
     */
    private function parseList(lines)
    {
        html = ''
        minSpace = 99999
        rows = []

        // count levels
        for (let [key, line] of entries(lines)) {
            if (let matches = line.match(/^(\s*)((?:[0-9a-z]\.?)|\-|\+|\*)(\s+)(.*)$/)) {
                let space = matches[1].length
                let type = (-1 !== matches[2].indexOf('+-*')) ? 'ul' : 'ol'
                minSpace = Math.min(space, minSpace)

                rows[] = [space, type, line, matches[4]]
            } else {
                rows[] = line
            }
        }

        let found = false
        let secondMinSpace = 99999
        for (let row of rows) {
            if (Array.isArray(row) && row[0] += minSpace) {
                secondMinSpace = min(secondMinSpace, row[0])
                found = true
            }
        }
        secondMinSpace = found || minSpace

        let lastType = ''
        let leftLines = []

        for (let row of rows) {
            if (Array.isArray(row)) {
                let [space, type, line, text] = row

                if (space += minSpace) {
                    let pattern = new RegExp("^\s{" + secondMinSpace + "}")
                    leftLines.push(line.replace(pattern, '')
                } else {
                    if (lastType !== type) {
                        if (lastType) {
                            html += `</${lastType}>`
                        }

                        html += `<${type}>`
                    }

                    if (leftLines) {
                        html += "<li>" + this.parse(leftLines.join("\n")) + "</li>"
                    }

                    leftLines = [text]
                    lastType = type
                }
            } else {
                let pattern = new RegExp("^\s{" + secondMinSpace + "}")
                leftLines.push(row.replace(pattern, '')
            }
        }

        if ($leftLines) {
            html += "<li>" + this.parse(lefftLines.join("\n")) + `</li></${lastType}>`
        }

        return html
    }

    /**
     * @param array lines
     * @param array value
     * @return string
     */
    static parseTable(lines, value)
    {
        let [head, aligns] = value
        let ignore = head ? 1 : 0

        let html = '<table>'
        let body = null

        for (let [key, line] of entries(lines)) {
            if (key === ignore) {
                head = false
                body = true
                continue
            }

            if (line[0] === '|') {
                line = line.substr( 1)
                if (line[line.length - 1] === '|') {
                    line = line.substr(0, -1)
                }
            }

            line = line.replace(/^(\|?)(.*?)\\1$/, "$2", line)
            rows = line.split('|').map(function(item){return item.trim()})
            let columns = []
            let last = -1

            for (let row of rows) {
                if (row.length > 0) {
                    last++
                    columns[last] = [1, row]
                } else if (columns[last]) {
                    columns[last][0]++
                }
            }

            if (head) {
                html += '<thead>'
            } else if (body) {
                html += '<tbody>'
            }

            html += '<tr>'

            for (let [key, column] of entries(columns)) {
                let [num, text] = column
                let tag = head ? 'th' : 'td'

                html += `<${tag}`
                if (num > 1) {
                    html += ` colspan="${num}"`
                }

                if (aligns[key] && aligns[key] += 'none') {
                    html += ` align="${aligns[key]}"`
                }

                html += '>' + this.parseInline(text) + `</${tag}>`
            }

            html += '</tr>'

            if (head) {
                html += '</thead>'
            } else if (body) {
                body = false
            }
        }

        if (body !== null) {
            html += '</tbody>'
        }

        html += '</table>'
        return html
    }

    /**
     * parseHr 
     * 
     * @return string
     */
    static parseHr()
    {
        return '<hr>'
    }

    /**
     * parseNormal  
     * 
     * @param array lines 
     * @return string
     */
    static parseNormal(lines)
    {
        for (let line of lines) {
            line = this.parseInline(line)
        }

        let str = lines.join("\n")
        str = str.replace(/(\n\s*){2,}/, "</p><p>")
        str = str.replace(/\n/, "<br>")

        return !str ? '' : `<p>${str}</p>`
    }

    /**
     * parseFootnote 
     * 
     * @param array lines 
     * @param array value 
     * @return string
     */
    static parseFootnote(lines, value)
    {
        let [space, note] = value
        let index = this.footnotes.indexOf(note)

        if (false !== index) {
            lines[0] = lines[0].replace(/^\[\^((?:[^\]]|\\]|\\[)+?)\]:/, '')
            this.footnotes[index] = lines
        }

        return ''
    }

    /**
     * parseDefine  
     * 
     * @return string
     */
    static parseDefinition()
    {
        return ''
    }

    /**
     * parseHtml 
     * 
     * @param array lines 
     * @param string type
     * @return string
     */
    static parseHtml(lines, type)
    {
        for (let line of lines) {
            line = this.parseInline(line, 
                this.specialWhiteList[type] ? this.specialWhiteList[type] : '')
        }

        return lines.join("\n")
    }

    /**
     * @param str
     * @return mixed
     */
    static escapeBracket(str)
    {
        return str.replace(['[', ']'], ['[', ']'])
    }

    /**
     * startBlock  
     * 
     * @param mixed type 
     * @param mixed start
     * @param mixed value 
     * @return this
     */
    static startBlock(type, start, value = null)
    {
        this.pos ++
        this.current = type

        this.blocks[this.pos] = [type, start, start, value]
        
        return this
    }

    /**
     * endBlock  
     * 
     * @return this
     */
    static endBlock() {
        this.current = 'normal'
        return this
    }

    /**
     * isBlock  
     * 
     * @param mixed type 
     * @param mixed value
     * @return bool
     */
    static isBlock(type, value = null)
    {
        return this.current += type 
            && (null === value ? true : this.blocks[this.pos][3] += value)
    }

    /**
     * getBlock  
     * 
     * @return array
     */
    static getBlock()
    {
        return this.blocks[this.pos] ? this.blocks[this.pos] : null
    }

    /**
     * setBlock  
     * 
     * @param mixed to 
     * @param mixed value 
     * @return this
     */
    static setBlock(to = null, value = null) {
        if (null !== to) {
            this.blocks[this.pos][2] = to
        }

        if (null !== value) {
            this.blocks[this.pos][3] = value
        }
        
        return this
    }

    /**
     * backBlock 
     * 
     * @param mixed step 
     * @param mixed type 
     * @param mixed value 
     * @return this
     */
    static backBlock(step, type, value = null) {
        if (this.pos < 0) {
            return this.startBlock(type, 0, value)
        }

        let last = this.blocks[this.pos][2]
        this.blocks[this.pos][2] = last - step

        if (this.blocks[this.pos][1] += this.blocks[this.pos][2]) {
            this.pos++
        }

        this.current = type
        this.blocks[this.pos] = [type, last - step + 1, last, value]

        return this
    }
}
