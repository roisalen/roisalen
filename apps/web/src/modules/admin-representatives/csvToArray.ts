/* Copyright 2012-2013 Daniel Tillin
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * csvToArray v2.1 (Unminifiled for development)
 *
 * For documentation visit:
 * http://code.google.com/p/csv-to-array/
 *
*/
export function csvToArray(
  text: string,
  options?: {
    fSep?: string;
    rSep?: string;
    quot?: string;
    head?: boolean;
    trim?: boolean;
  }
): [string, string?, string?, string?][] {
  const od = {
    'fSep': ',',
    'rSep': '\n',
    'quot': '"',
    'head': false,
    'trim': false,
    ...options
  };

  const a: string[][] = [['']];
  for (let r = 0, f = 0, p = 0, q = 0; p < text.length; p++) {
    const c = text.charAt(p);
    switch (c) {
      case od.quot:
        if (q && text.charAt(p + 1) == od.quot) {
          a[r][f] += od.quot;
          ++p;
        } else {
          q ^= 1;
        }
        break;
      case od.fSep:
        if (!q) {
          if (od.trim) {
            a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
          }
          a[r][++f] = '';
        } else {
          a[r][f] += c;
        }
        break;
      case od.rSep.charAt(0):
        if (!q && (!od.rSep.charAt(1) || (od.rSep.charAt(1) && od.rSep.charAt(1) == text.charAt(p + 1)))) {
          if (od.trim) {
            a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
          }
          a[++r] = [''];
          a[r][f = 0] = '';
          if (od.rSep.charAt(1)) {
            ++p;
          }
        } else {
          a[r][f] += c;
        }
        break;
      default:
        a[r][f] += c;
    }
  }
  if (od.head) {
    a.shift();
  }
  if (a[a.length - 1].length < a[0].length) {
    a.pop();
  }

  return a.map(row => [
    row[0] || '',
    row[1],
    row[2],
    row[3]
  ] as [string, string?, string?, string?]);
} 