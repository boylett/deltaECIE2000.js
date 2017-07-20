# deltaECIE2000.js
[Delta-E CIE2000](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000) colour distance calculator ported from PHP to JavaScript:  
https://github.com/renasboy/php-color-difference

### Usage:
    var rgb1 = [255, 0, 0],
        rgb2 = [100, 0, 0],
        diff = deltaECIE2000(rgb1, rgb2);
