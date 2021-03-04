/*!
 * VERSION: 0.16.2
 * DATE: 2018-02-15
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * Requires TweenLite and CSSPlugin version 1.17.0 or later (TweenMax contains both TweenLite and CSSPlugin). ThrowPropsPlugin is required for momentum-based continuation of movement after the mouse/touch is released (ThrowPropsPlugin is a membership benefit of Club GreenSock - http://greensock.com/club/).
 *
 * @license Copyright (c) 2008-2018, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
        "use strict";
        _gsScope._gsDefine("utils.Draggable", ["events.EventDispatcher", "TweenLite", "plugins.CSSPlugin"], function (a, b, c) {
            var d, e, f, g, h, i, j, k, l, m = {
                    css: {},
                    data: "_draggable"
                },
                n = {
                    css: {},
                    data: "_draggable"
                },
                o = {
                    css: {},
                    data: "_draggable"
                },
                p = {
                    css: {}
                },
                q = _gsScope._gsDefine.globals,
                r = {},
                s = {
                    style: {}
                },
                t = _gsScope.document || {
                    createElement: function () {
                        return s
                    }
                },
                u = t.documentElement || {},
                v = function (a) {
                    return t.createElementNS ? t.createElementNS("http://www.w3.org/1999/xhtml", a) : t.createElement(a)
                },
                w = v("div"),
                x = [],
                y = function () {
                    return !1
                },
                z = 180 / Math.PI,
                A = 999999999999999,
                B = Date.now || function () {
                    return (new Date).getTime()
                },
                C = !(t.addEventListener || !t.all),
                D = t.createElement("div"),
                E = [],
                F = {},
                G = 0,
                H = /^(?:a|input|textarea|button|select)$/i,
                I = 0,
                J = _gsScope.navigator && -1 !== _gsScope.navigator.userAgent.toLowerCase().indexOf("android"),
                K = 0,
                L = {},
                M = {},
                N = function (a) {
                    if ("string" == typeof a && (a = b.selector(a)), !a || a.nodeType) return [a];
                    var c, d = [],
                        e = a.length;
                    for (c = 0; c !== e; d.push(a[c++]));
                    return d
                },
                O = function (a, b) {
                    var c, d = {};
                    if (b)
                        for (c in a) d[c] = a[c] * b;
                    else
                        for (c in a) d[c] = a[c];
                    return d
                },
                P = function () {
                    for (var a = E.length; --a > -1;) E[a]()
                },
                Q = function (a) {
                    E.push(a), 1 === E.length && b.ticker.addEventListener("tick", P, this, !1, 1)
                },
                R = function (a) {
                    for (var c = E.length; --c > -1;) E[c] === a && E.splice(c, 1);
                    b.to(S, 0, {
                        overwrite: "all",
                        delay: 15,
                        onComplete: S,
                        data: "_draggable"
                    })
                },
                S = function () {
                    E.length || b.ticker.removeEventListener("tick", P)
                },
                T = function (a, b) {
                    var c;
                    for (c in b) void 0 === a[c] && (a[c] = b[c]);
                    return a
                },
                U = function () {
                    return null != window.pageYOffset ? window.pageYOffset : null != t.scrollTop ? t.scrollTop : u.scrollTop || t.body.scrollTop || 0
                },
                V = function () {
                    return null != window.pageXOffset ? window.pageXOffset : null != t.scrollLeft ? t.scrollLeft : u.scrollLeft || t.body.scrollLeft || 0
                },
                W = function (a, b) {
                    Ja(a, "scroll", b), Y(a.parentNode) || W(a.parentNode, b)
                },
                X = function (a, b) {
                    Ka(a, "scroll", b), Y(a.parentNode) || X(a.parentNode, b)
                },
                Y = function (a) {
                    return !(a && a !== u && a !== t && a !== t.body && a !== window && a.nodeType && a.parentNode)
                },
                Z = function (a, b) {
                    var c = "x" === b ? "Width" : "Height",
                        d = "scroll" + c,
                        e = "client" + c,
                        f = t.body;
                    return Math.max(0, Y(a) ? Math.max(u[d], f[d]) - (window["inner" + c] || u[e] || f[e]) : a[d] - a[e])
                },
                $ = function (a) {
                    var b = Y(a),
                        c = Z(a, "x"),
                        d = Z(a, "y");
                    b ? a = M : $(a.parentNode), a._gsMaxScrollX = c, a._gsMaxScrollY = d, a._gsScrollX = a.scrollLeft || 0, a._gsScrollY = a.scrollTop || 0
                },
                _ = function (a, b) {
                    return a = a || window.event, r.pageX = a.clientX + t.body.scrollLeft + u.scrollLeft, r.pageY = a.clientY + t.body.scrollTop + u.scrollTop, b && (a.returnValue = !1), r
                },
                aa = function (a) {
                    return a ? ("string" == typeof a && (a = b.selector(a)), a.length && a !== window && a[0] && a[0].style && !a.nodeType && (a = a[0]), a === window || a.nodeType && a.style ? a : null) : a
                },
                ba = function (a, b) {
                    var c, e, f, g = a.style;
                    if (void 0 === g[b]) {
                        for (f = ["O", "Moz", "ms", "Ms", "Webkit"], e = 5, c = b.charAt(0).toUpperCase() + b.substr(1); --e > -1 && void 0 === g[f[e] + c];);
                        if (0 > e) return "";
                        d = 3 === e ? "ms" : f[e], b = d + c
                    }
                    return b
                },
                ca = function (a, b, c) {
                    var d = a.style;
                    d && (void 0 === d[b] && (b = ba(a, b)), null == c ? d.removeProperty ? d.removeProperty(b.replace(/([A-Z])/g, "-$1").toLowerCase()) : d.removeAttribute(b) : void 0 !== d[b] && (d[b] = c))
                },
                da = t.defaultView ? t.defaultView.getComputedStyle : y,
                ea = /(?:Left|Right|Width)/i,
                fa = /(?:\d|\-|\+|=|#|\.)*/g,
                ga = function (a, b, c, d, e) {
                    if ("px" === d || !d) return c;
                    if ("auto" === d || !c) return 0;
                    var f, g = ea.test(b),
                        h = a,
                        i = w.style,
                        j = 0 > c;
                    return j && (c = -c), "%" === d && -1 !== b.indexOf("border") ? f = c / 100 * (g ? a.clientWidth : a.clientHeight) : (i.cssText = "border:0 solid red;position:" + ia(a, "position", !0) + ";line-height:0;", "%" !== d && h.appendChild ? i[g ? "borderLeftWidth" : "borderTopWidth"] = c + d : (h = a.parentNode || t.body, i[g ? "width" : "height"] = c + d), h.appendChild(w), f = parseFloat(w[g ? "offsetWidth" : "offsetHeight"]), h.removeChild(w), 0 !== f || e || (f = ga(a, b, c, d, !0))), j ? -f : f
                },
                ha = function (a, b) {
                    if ("absolute" !== ia(a, "position", !0)) return 0;
                    var c = "left" === b ? "Left" : "Top",
                        d = ia(a, "margin" + c, !0);
                    return a["offset" + c] - (ga(a, b, parseFloat(d), (d + "").replace(fa, "")) || 0)
                },
                ia = function (a, b, c) {
                    var d, e = (a._gsTransform || {})[b];
                    return e || 0 === e ? e : (a.style[b] ? e = a.style[b] : (d = da(a)) ? (e = d.getPropertyValue(b.replace(/([A-Z])/g, "-$1").toLowerCase()), e = e || d.length ? e : d[b]) : a.currentStyle && (e = a.currentStyle[b]), "auto" !== e || "top" !== b && "left" !== b || (e = ha(a, b)), c ? e : parseFloat(e) || 0)
                },
                ja = function (a, b, c) {
                    var d = a.vars,
                        e = d[c],
                        f = a._listeners[b];
                    "function" == typeof e && e.apply(d[c + "Scope"] || d.callbackScope || a, d[c + "Params"] || [a.pointerEvent]), f && a.dispatchEvent(b)
                },
                ka = function (a, b) {
                    var c, d, e, f = aa(a);
                    return f ? Ea(f, b) : void 0 !== a.left ? (e = ya(b), {
                        left: a.left - e.x,
                        top: a.top - e.y,
                        width: a.width,
                        height: a.height
                    }) : (d = a.min || a.minX || a.minRotation || 0, c = a.min || a.minY || 0, {
                        left: d,
                        top: c,
                        width: (a.max || a.maxX || a.maxRotation || 0) - d,
                        height: (a.max || a.maxY || 0) - c
                    })
                },
                la = function () {
                    if (!t.createElementNS) return g = 0, void(h = !1);
                    var a, b, c, d, e = v("div"),
                        f = t.createElementNS("http://www.w3.org/2000/svg", "svg"),
                        l = v("div"),
                        m = e.style,
                        n = t.body || u,
                        o = "flex" === ia(n, "display", !0);
                    t.body && oa && (m.position = "absolute", n.appendChild(l), l.appendChild(e), d = e.offsetParent, l.style[oa] = "rotate(1deg)", k = e.offsetParent === d, l.style.position = "absolute", m.height = "10px", d = e.offsetTop, l.style.border = "5px solid red", j = d !== e.offsetTop, n.removeChild(l)), m = f.style, f.setAttributeNS(null, "width", "400px"), f.setAttributeNS(null, "height", "400px"), f.setAttributeNS(null, "viewBox", "0 0 400 400"), m.display = "block", m.boxSizing = "border-box", m.border = "0px solid red", m.transform = "none", e.style.cssText = "width:100px;height:100px;overflow:scroll;-ms-overflow-style:none;", n.appendChild(e), e.appendChild(f), c = f.createSVGPoint().matrixTransform(f.getScreenCTM()), b = c.y, e.scrollTop = 100, c.x = c.y = 0, c = c.matrixTransform(f.getScreenCTM()), i = b - c.y < 100.1 ? 0 : b - c.y - 150, e.removeChild(f), n.removeChild(e), n.appendChild(f), o && (n.style.display = "block"), a = f.getScreenCTM(), b = a.e, m.border = "50px solid red", a = f.getScreenCTM(), 0 === b && 0 === a.e && 0 === a.f && 1 === a.a ? (g = 1, h = !0) : (g = b !== a.e ? 1 : 0, h = 1 !== a.a), o && (n.style.display = "flex"), n.removeChild(f)
                },
                ma = "" !== ba(w, "perspective"),
                na = ba(w, "transformOrigin").replace(/^ms/g, "Ms").replace(/([A-Z])/g, "-$1").toLowerCase(),
                oa = ba(w, "transform"),
                pa = oa.replace(/^ms/g, "Ms").replace(/([A-Z])/g, "-$1").toLowerCase(),
                qa = {},
                ra = {},
                sa = _gsScope.SVGElement,
                ta = function (a) {
                    return !!(sa && "function" == typeof a.getBBox && a.getCTM && (!a.parentNode || a.parentNode.getBBox && a.parentNode.getCTM))
                },
                ua = (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(navigator.userAgent) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(navigator.userAgent)) && parseFloat(RegExp.$1) < 11,
                va = [],
                wa = [],
                xa = function (a) {
                    if (!a.getBoundingClientRect || !a.parentNode || !oa) return {
                        offsetTop: 0,
                        offsetLeft: 0,
                        scaleX: 1,
                        scaleY: 1,
                        offsetParent: u
                    };
                    if (Ta.cacheSVGData !== !1 && a._dCache && a._dCache.lastUpdate === b.ticker.frame) return a._dCache;
                    var c, d, e, f, j, k, l, m, n, o, p, q, r = a,
                        s = za(a);
                    if (s.lastUpdate = b.ticker.frame, a.getBBox && !s.isSVGRoot) {
                        for (r = a.parentNode, c = a.getBBox(); r && "svg" !== (r.nodeName + "").toLowerCase();) r = r.parentNode;
                        return f = xa(r), s.offsetTop = c.y * f.scaleY, s.offsetLeft = c.x * f.scaleX, s.scaleX = f.scaleX, s.scaleY = f.scaleY, s.offsetParent = r || u, s
                    }
                    for (e = s.offsetParent, e === t.body && (e = u), wa.length = va.length = 0; r && (j = ia(r, oa, !0), "matrix(1, 0, 0, 1, 0, 0)" !== j && "none" !== j && "translate3d(0px, 0px, 0px)" !== j && (wa.push(r), va.push(r.style[oa]), r.style[oa] = "none"), r !== e);) r = r.parentNode;
                    for (d = e.getBoundingClientRect(), j = a.getScreenCTM(), m = a.createSVGPoint(), l = m.matrixTransform(j), m.x = m.y = 10, m = m.matrixTransform(j), s.scaleX = (m.x - l.x) / 10, s.scaleY = (m.y - l.y) / 10, void 0 === g && la(), s.borderBox && !h && a.getAttribute("width") && (f = da(a) || {}, n = parseFloat(f.borderLeftWidth) + parseFloat(f.borderRightWidth) || 0, o = parseFloat(f.borderTopWidth) + parseFloat(f.borderBottomWidth) || 0, p = parseFloat(f.width) || 0, q = parseFloat(f.height) || 0, s.scaleX *= (p - n) / p, s.scaleY *= (q - o) / q), i ? (c = a.getBoundingClientRect(), s.offsetLeft = c.left - d.left, s.offsetTop = c.top - d.top) : (s.offsetLeft = l.x - d.left, s.offsetTop = l.y - d.top), s.offsetParent = e, k = wa.length; --k > -1;) wa[k].style[oa] = va[k];
                    return s
                },
                ya = function (a, c) {
                    if (c = c || {}, !a || a === u || !a.parentNode || a === window) return {
                        x: 0,
                        y: 0
                    };
                    var d = da(a),
                        e = na && d ? d.getPropertyValue(na) : "50% 50%",
                        f = e.split(" "),
                        g = -1 !== e.indexOf("left") ? "0%" : -1 !== e.indexOf("right") ? "100%" : f[0],
                        h = -1 !== e.indexOf("top") ? "0%" : -1 !== e.indexOf("bottom") ? "100%" : f[1];
                    return ("center" === h || null == h) && (h = "50%"), ("center" === g || isNaN(parseFloat(g))) && (g = "50%"), a.getBBox && ta(a) ? (a._gsTransform || (b.set(a, {
                        x: "+=0",
                        overwrite: !1
                    }), void 0 === a._gsTransform.xOrigin && console.log("Draggable requires at least GSAP 1.17.0")), e = a.getBBox(), c.x = a._gsTransform.xOrigin - e.x, c.y = a._gsTransform.yOrigin - e.y) : (a.getBBox && -1 !== (g + h).indexOf("%") && (a = a.getBBox(), a = {
                        offsetWidth: a.width,
                        offsetHeight: a.height
                    }), c.x = -1 !== g.indexOf("%") ? a.offsetWidth * parseFloat(g) / 100 : parseFloat(g), c.y = -1 !== h.indexOf("%") ? a.offsetHeight * parseFloat(h) / 100 : parseFloat(h)), c
                },
                za = function (a) {
                    if (Ta.cacheSVGData !== !1 && a._dCache && a._dCache.lastUpdate === b.ticker.frame) return a._dCache;
                    var c, d = a._dCache = a._dCache || {},
                        e = da(a),
                        f = a.getBBox && ta(a),
                        g = "svg" === (a.nodeName + "").toLowerCase();
                    if (d.isSVG = f, d.isSVGRoot = g, d.borderBox = "border-box" === e.boxSizing, d.computedStyle = e, g) c = a.parentNode || u, c.insertBefore(w, a), d.offsetParent = w.offsetParent || u, c.removeChild(w);
                    else if (f) {
                        for (c = a.parentNode; c && "svg" !== (c.nodeName + "").toLowerCase();) c = c.parentNode;
                        d.offsetParent = c
                    } else d.offsetParent = a.offsetParent;
                    return d
                },
                Aa = function (a, b, c, d, e) {
                    if (a === window || !a || !a.style || !a.parentNode) return [1, 0, 0, 1, 0, 0];
                    var f, h, i, l, m, n, o, p, q, r, s, v, w, x, y = a._dCache || za(a),
                        z = a.parentNode,
                        A = z._dCache || za(z),
                        B = y.computedStyle,
                        C = y.isSVG ? A.offsetParent : z.offsetParent;
                    return f = y.isSVG && -1 !== (a.style[oa] + "").indexOf("matrix") ? a.style[oa] : B ? B.getPropertyValue(pa) : a.currentStyle ? a.currentStyle[oa] : "1,0,0,1,0,0", a.getBBox && -1 !== (a.getAttribute("transform") + "").indexOf("matrix") && (f = a.getAttribute("transform")), f = (f + "").match(/(?:\-|\.|\b)(\d|\.|e\-)+/g) || [1, 0, 0, 1, 0, 0], f.length > 6 && (f = [f[0], f[1], f[4], f[5], f[12], f[13]]), d ? f[4] = f[5] = 0 : y.isSVG && (m = a._gsTransform) && (m.xOrigin || m.yOrigin) && (f[0] = parseFloat(f[0]), f[1] = parseFloat(f[1]), f[2] = parseFloat(f[2]), f[3] = parseFloat(f[3]), f[4] = parseFloat(f[4]) - (m.xOrigin - (m.xOrigin * f[0] + m.yOrigin * f[2])), f[5] = parseFloat(f[5]) - (m.yOrigin - (m.xOrigin * f[1] + m.yOrigin * f[3]))), b && (void 0 === g && la(), i = y.isSVG || y.isSVGRoot ? xa(a) : a, y.isSVG ? (l = a.getBBox(), r = A.isSVGRoot ? {
                        x: 0,
                        y: 0
                    } : z.getBBox(), i = {
                        offsetLeft: l.x - r.x,
                        offsetTop: l.y - r.y,
                        offsetParent: y.offsetParent
                    }) : y.isSVGRoot ? (s = parseInt(B.borderTopWidth, 10) || 0, v = parseInt(B.borderLeftWidth, 10) || 0, w = (f[0] - g) * v + f[2] * s, x = f[1] * v + (f[3] - g) * s, n = b.x, o = b.y, p = n - (n * f[0] + o * f[2]), q = o - (n * f[1] + o * f[3]), f[4] = parseFloat(f[4]) + p, f[5] = parseFloat(f[5]) + q, b.x -= p, b.y -= q, n = i.scaleX, o = i.scaleY, e || (b.x *= n, b.y *= o), f[0] *= n, f[1] *= o, f[2] *= n, f[3] *= o, ua || (b.x += w, b.y += x), C === t.body && i.offsetParent === u && (C = u)) : !j && a.offsetParent && (b.x += parseInt(ia(a.offsetParent, "borderLeftWidth"), 10) || 0, b.y += parseInt(ia(a.offsetParent, "borderTopWidth"), 10) || 0), h = z === u || z === t.body, f[4] = Number(f[4]) + b.x + (i.offsetLeft || 0) - c.x - (h ? 0 : z.scrollLeft || 0), f[5] = Number(f[5]) + b.y + (i.offsetTop || 0) - c.y - (h ? 0 : z.scrollTop || 0), z && "fixed" === ia(a, "position", B) && (f[4] += V(), f[5] += U()), !z || z === u || C !== i.offsetParent || A.isSVG || k && "100100" !== Aa(z).join("") || (i = A.isSVGRoot ? xa(z) : z, f[4] -= i.offsetLeft || 0, f[5] -= i.offsetTop || 0, j || !A.offsetParent || y.isSVG || y.isSVGRoot || (f[4] -= parseInt(ia(A.offsetParent, "borderLeftWidth"), 10) || 0, f[5] -= parseInt(ia(A.offsetParent, "borderTopWidth"), 10) || 0))), f
                },
                Ba = function (a, b) {
                    if (!a || a === window || !a.parentNode) return [1, 0, 0, 1, 0, 0];
                    for (var c, d, e, f, g, h, i, j, k = ya(a, qa), l = ya(a.parentNode, ra), m = Aa(a, k, l, !1, !b);
                        (a = a.parentNode) && a.parentNode && a !== u;) k = l, l = ya(a.parentNode, k === qa ? ra : qa), i = Aa(a, k, l), c = m[0], d = m[1], e = m[2], f = m[3], g = m[4], h = m[5], m[0] = c * i[0] + d * i[2], m[1] = c * i[1] + d * i[3], m[2] = e * i[0] + f * i[2], m[3] = e * i[1] + f * i[3], m[4] = g * i[0] + h * i[2] + i[4], m[5] = g * i[1] + h * i[3] + i[5];
                    return b && (c = m[0], d = m[1], e = m[2], f = m[3], g = m[4], h = m[5], j = c * f - d * e, m[0] = f / j, m[1] = -d / j, m[2] = -e / j, m[3] = c / j, m[4] = (e * h - f * g) / j, m[5] = -(c * h - d * g) / j), m
                },
                Ca = function (a, b, c, d, e) {
                    a = aa(a);
                    var f = Ba(a, !1, e),
                        g = b.x,
                        h = b.y;
                    return c && (ya(a, b), g -= b.x, h -= b.y), d = d === !0 ? b : d || {}, d.x = g * f[0] + h * f[2] + f[4], d.y = g * f[1] + h * f[3] + f[5], d
                },
                Da = function (a, b, c) {
                    var d = a.x * b[0] + a.y * b[2] + b[4],
                        e = a.x * b[1] + a.y * b[3] + b[5];
                    return a.x = d * c[0] + e * c[2] + c[4], a.y = d * c[1] + e * c[3] + c[5], a
                },
                Ea = function (a, b, c) {
                    if (!(a = aa(a))) return null;
                    b = aa(b);
                    var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, v, w, x, y, z, A, B = a.getBBox && ta(a);
                    if (a === window) g = U(), e = V(), f = e + (u.clientWidth || a.innerWidth || t.body.clientWidth || 0), h = g + ((a.innerHeight || 0) - 20 < u.clientHeight ? u.clientHeight : a.innerHeight || t.body.clientHeight || 0);
                    else {
                        if (void 0 === b || b === window) return a.getBoundingClientRect();
                        d = ya(a), e = -d.x, g = -d.y, B ? (o = a.getBBox(), p = o.width, q = o.height) : "svg" !== (a.nodeName + "").toLowerCase() && a.offsetWidth ? (p = a.offsetWidth, q = a.offsetHeight) : (z = da(a), p = parseFloat(z.width), q = parseFloat(z.height)), f = e + p, h = g + q, "svg" !== a.nodeName.toLowerCase() || C || (r = xa(a), A = r.computedStyle || {}, w = (a.getAttribute("viewBox") || "0 0").split(" "), x = parseFloat(w[0]), y = parseFloat(w[1]), s = parseFloat(A.borderLeftWidth) || 0, v = parseFloat(A.borderTopWidth) || 0, f -= p - (p - s) / r.scaleX - x, h -= q - (q - v) / r.scaleY - y, e -= s / r.scaleX - x, g -= v / r.scaleY - y, z && (f += (parseFloat(A.borderRightWidth) + s) / r.scaleX, h += (v + parseFloat(A.borderBottomWidth)) / r.scaleY))
                    }
                    return a === b ? {
                        left: e,
                        top: g,
                        width: f - e,
                        height: h - g
                    } : (i = Ba(a), j = Ba(b, !0), k = Da({
                        x: e,
                        y: g
                    }, i, j), l = Da({
                        x: f,
                        y: g
                    }, i, j), m = Da({
                        x: f,
                        y: h
                    }, i, j), n = Da({
                        x: e,
                        y: h
                    }, i, j), e = Math.min(k.x, l.x, m.x, n.x), g = Math.min(k.y, l.y, m.y, n.y), L.x = L.y = 0, c && ya(b, L), {
                        left: e + L.x,
                        top: g + L.y,
                        width: Math.max(k.x, l.x, m.x, n.x) - e,
                        height: Math.max(k.y, l.y, m.y, n.y) - g
                    })
                },
                Fa = function (a) {
                    return a && a.length && a[0] && (a[0].nodeType && a[0].style && !a.nodeType || a[0].length && a[0][0]) ? !0 : !1
                },
                Ga = function (a) {
                    var b, c, d, e = [],
                        f = a.length;
                    for (b = 0; f > b; b++)
                        if (c = a[b], Fa(c))
                            for (d = c.length, d = 0; d < c.length; d++) e.push(c[d]);
                        else c && 0 !== c.length && e.push(c);
                    return e
                },
                Ha = "ontouchstart" in u && "orientation" in window,
                Ia = function (a) {
                    for (var b = a.split(","), c = (void 0 !== w.onpointerdown ? "pointerdown,pointermove,pointerup,pointercancel" : void 0 !== w.onmspointerdown ? "MSPointerDown,MSPointerMove,MSPointerUp,MSPointerCancel" : a).split(","), d = {}, e = 4; --e > -1;) d[b[e]] = c[e], d[c[e]] = b[e];
                    return d
                }("touchstart,touchmove,touchend,touchcancel"),
                Ja = function (a, b, c, d) {
                    a.addEventListener ? (a.addEventListener(Ia[b], c, d), b !== Ia[b] && a.addEventListener(b, c, d)) : a.attachEvent && a.attachEvent("on" + b, c)
                },
                Ka = function (a, b, c) {
                    a.removeEventListener ? (a.removeEventListener(Ia[b], c), b !== Ia[b] && a.removeEventListener(b, c)) : a.detachEvent && a.detachEvent("on" + b, c)
                },
                La = function (a, b) {
                    for (var c = a.length; --c > -1;)
                        if (a[c].identifier === b) return !0;
                    return !1
                },
                Ma = function (a) {
                    e = a.touches && I < a.touches.length, Ka(a.target, "touchend", Ma)
                },
                Na = function (a) {
                    e = a.touches && I < a.touches.length, Ja(a.target, "touchend", Ma)
                },
                Oa = function (a, b, c, d, e, f) {
                    var g, h, i, j = {};
                    if (b)
                        if (1 !== e && b instanceof Array) {
                            if (j.end = g = [], i = b.length, "object" == typeof b[0])
                                for (h = 0; i > h; h++) g[h] = O(b[h], e);
                            else
                                for (h = 0; i > h; h++) g[h] = b[h] * e;
                            c += 1.1, d -= 1.1
                        } else "function" == typeof b ? j.end = function (c) {
                            var d, f, g = b.call(a, c);
                            if (1 !== e)
                                if ("object" == typeof g) {
                                    d = {};
                                    for (f in g) d[f] = g[f] * e;
                                    g = d
                                } else g *= e;
                            return g
                        } : j.end = b;
                    return (c || 0 === c) && (j.max = c), (d || 0 === d) && (j.min = d), f && (j.velocity = 0), j
                },
                Pa = function (a) {
                    var b;
                    return a && a.getAttribute && "BODY" !== a.nodeName ? "true" === (b = a.getAttribute("data-clickable")) || "false" !== b && (a.onclick || H.test(a.nodeName + "") || "true" === a.getAttribute("contentEditable")) ? !0 : Pa(a.parentNode) : !1
                },
                Qa = function (a, b) {
                    for (var c, d = a.length; --d > -1;) c = a[d], c.ondragstart = c.onselectstart = b ? null : y, ca(c, "userSelect", b ? "text" : "none")
                },
                Ra = function () {
                    var a, b = t.createElement("div"),
                        c = t.createElement("div"),
                        d = c.style,
                        e = t.body || w;
                    return d.display = "inline-block", d.position = "relative", b.style.cssText = c.innerHTML = "width:90px; height:40px; padding:10px; overflow:auto; visibility: hidden", b.appendChild(c), e.appendChild(b), l = c.offsetHeight + 18 > b.scrollHeight, d.width = "100%", oa || (d.paddingRight = "500px", a = b.scrollLeft = b.scrollWidth - b.clientWidth, d.left = "-90px", a = a !== b.scrollLeft), e.removeChild(b), a
                }(),
                Sa = function (a, c) {
                    a = aa(a), c = c || {};
                    var d, e, f, g, h, i, j = t.createElement("div"),
                        k = j.style,
                        m = a.firstChild,
                        n = 0,
                        o = 0,
                        p = a.scrollTop,
                        q = a.scrollLeft,
                        r = a.scrollWidth,
                        s = a.scrollHeight,
                        u = 0,
                        v = 0,
                        w = 0;
                    ma && c.force3D !== !1 ? (h = "translate3d(", i = "px,0px)") : oa && (h = "translate(", i = "px)"), this.scrollTop = function (a, b) {
                        return arguments.length ? void this.top(-a, b) : -this.top()
                    }, this.scrollLeft = function (a, b) {
                        return arguments.length ? void this.left(-a, b) : -this.left()
                    }, this.left = function (d, e) {
                        if (!arguments.length) return -(a.scrollLeft + o);
                        var f = a.scrollLeft - q,
                            g = o;
                        return (f > 2 || -2 > f) && !e ? (q = a.scrollLeft, b.killTweensOf(this, !0, {
                            left: 1,
                            scrollLeft: 1
                        }), this.left(-q), void(c.onKill && c.onKill())) : (d = -d, 0 > d ? (o = d - .5 | 0, d = 0) : d > v ? (o = d - v | 0, d = v) : o = 0, (o || g) && (h ? this._suspendTransforms || (k[oa] = h + -o + "px," + -n + i) : k.left = -o + "px", Ra && o + u >= 0 && (k.paddingRight = o + u + "px")), a.scrollLeft = 0 | d, void(q = a.scrollLeft))
                    }, this.top = function (d, e) {
                        if (!arguments.length) return -(a.scrollTop + n);
                        var f = a.scrollTop - p,
                            g = n;
                        return (f > 2 || -2 > f) && !e ? (p = a.scrollTop, b.killTweensOf(this, !0, {
                            top: 1,
                            scrollTop: 1
                        }), this.top(-p), void(c.onKill && c.onKill())) : (d = -d, 0 > d ? (n = d - .5 | 0, d = 0) : d > w ? (n = d - w | 0, d = w) : n = 0, (n || g) && (h ? this._suspendTransforms || (k[oa] = h + -o + "px," + -n + i) : k.top = -n + "px"), a.scrollTop = 0 | d, void(p = a.scrollTop))
                    }, this.maxScrollTop = function () {
                        return w
                    }, this.maxScrollLeft = function () {
                        return v
                    }, this.disable = function () {
                        for (m = j.firstChild; m;) g = m.nextSibling, a.appendChild(m), m = g;
                        a === j.parentNode && a.removeChild(j)
                    }, this.enable = function () {
                        if (m = a.firstChild, m !== j) {
                            for (; m;) g = m.nextSibling, j.appendChild(m), m = g;
                            a.appendChild(j), this.calibrate()
                        }
                    }, this.calibrate = function (b) {
                        var c, g, h = a.clientWidth === d;
                        p = a.scrollTop, q = a.scrollLeft, (!h || a.clientHeight !== e || j.offsetHeight !== f || r !== a.scrollWidth || s !== a.scrollHeight || b) && ((n || o) && (c = this.left(), g = this.top(), this.left(-a.scrollLeft), this.top(-a.scrollTop)), (!h || b) && (k.display = "block", k.width = "auto", k.paddingRight = "0px", u = Math.max(0, a.scrollWidth - a.clientWidth), u && (u += ia(a, "paddingLeft") + (l ? ia(a, "paddingRight") : 0))), k.display = "inline-block", k.position = "relative", k.overflow = "visible", k.verticalAlign = "top", k.width = "100%", k.paddingRight = u + "px", l && (k.paddingBottom = ia(a, "paddingBottom", !0)), C && (k.zoom = "1"), d = a.clientWidth, e = a.clientHeight, r = a.scrollWidth, s = a.scrollHeight, v = a.scrollWidth - d, w = a.scrollHeight - e, f = j.offsetHeight, k.display = "block", (c || g) && (this.left(c), this.top(g)))
                    }, this.content = j, this.element = a, this._suspendTransforms = !1, this.enable()
                },
                Ta = function (d, g) {
                    a.call(this, d), d = aa(d), f || (f = q.com.greensock.plugins.ThrowPropsPlugin), this.vars = g = O(g || {}), this.target = d, this.x = this.y = this.rotation = 0, this.dragResistance = parseFloat(g.dragResistance) || 0, this.edgeResistance = isNaN(g.edgeResistance) ? 1 : parseFloat(g.edgeResistance) || 0, this.lockAxis = g.lockAxis, this.autoScroll = g.autoScroll || 0, this.lockedAxis = null, this.allowEventDefault = !!g.allowEventDefault;
                    var h, i, j, k, l, r, s, v, w, y, E, H, P, S, U, V, Z, ba, da, ea, fa, ga, ha, la, ma, na, oa, pa, qa, ra, sa, ua, va, wa, xa = (g.type || (C ? "top,left" : "x,y")).toLowerCase(),
                        ya = -1 !== xa.indexOf("x") || -1 !== xa.indexOf("y"),
                        za = -1 !== xa.indexOf("rotation"),
                        Aa = za ? "rotation" : ya ? "x" : "left",
                        Da = ya ? "y" : "top",
                        Ea = -1 !== xa.indexOf("x") || -1 !== xa.indexOf("left") || "scroll" === xa,
                        Fa = -1 !== xa.indexOf("y") || -1 !== xa.indexOf("top") || "scroll" === xa,
                        Ga = g.minimumMovement || 2,
                        Ma = this,
                        Ra = N(g.trigger || g.handle || d),
                        Ua = {},
                        Va = 0,
                        Wa = !1,
                        Ya = g.autoScrollMarginTop || 40,
                        Za = g.autoScrollMarginRight || 40,
                        $a = g.autoScrollMarginBottom || 40,
                        _a = g.autoScrollMarginLeft || 40,
                        ab = g.clickableTest || Pa,
                        bb = 0,
                        cb = function (a) {
                            return Ma.isPressed && a.which < 2 ? void Ma.endDrag() : (a.preventDefault(), a.stopPropagation(), !1)
                        },
                        db = function (a) {
                            if (Ma.autoScroll && Ma.isDragging && (Wa || ba)) {
                                var b, c, e, f, g, h, j, k, l = d,
                                    m = 15 * Ma.autoScroll;
                                for (Wa = !1, M.scrollTop = null != window.pageYOffset ? window.pageYOffset : null != u.scrollTop ? u.scrollTop : t.body.scrollTop, M.scrollLeft = null != window.pageXOffset ? window.pageXOffset : null != u.scrollLeft ? u.scrollLeft : t.body.scrollLeft, f = Ma.pointerX - M.scrollLeft, g = Ma.pointerY - M.scrollTop; l && !c;) c = Y(l.parentNode), b = c ? M : l.parentNode, e = c ? {
                                    bottom: Math.max(u.clientHeight, window.innerHeight || 0),
                                    right: Math.max(u.clientWidth, window.innerWidth || 0),
                                    left: 0,
                                    top: 0
                                } : b.getBoundingClientRect(), h = j = 0, Fa && (k = b._gsMaxScrollY - b.scrollTop, 0 > k ? j = k : g > e.bottom - $a && k ? (Wa = !0, j = Math.min(k, m * (1 - Math.max(0, e.bottom - g) / $a) | 0)) : g < e.top + Ya && b.scrollTop && (Wa = !0, j = -Math.min(b.scrollTop, m * (1 - Math.max(0, g - e.top) / Ya) | 0)), j && (b.scrollTop += j)), Ea && (k = b._gsMaxScrollX - b.scrollLeft, 0 > k ? h = k : f > e.right - Za && k ? (Wa = !0, h = Math.min(k, m * (1 - Math.max(0, e.right - f) / Za) | 0)) : f < e.left + _a && b.scrollLeft && (Wa = !0, h = -Math.min(b.scrollLeft, m * (1 - Math.max(0, f - e.left) / _a) | 0)), h && (b.scrollLeft += h)), c && (h || j) && (window.scrollTo(b.scrollLeft, b.scrollTop), rb(Ma.pointerX + h, Ma.pointerY + j)), l = b
                            }
                            if (ba) {
                                var n = Ma.x,
                                    o = Ma.y,
                                    p = 1e-6;
                                p > n && n > -p && (n = 0), p > o && o > -p && (o = 0), za ? (Ma.deltaX = n - qa.data.rotation, qa.data.rotation = Ma.rotation = n, qa.setRatio(1)) : i ? (Fa && (Ma.deltaY = o - i.top(), i.top(o)), Ea && (Ma.deltaX = n - i.left(), i.left(n))) : ya ? (Fa && (Ma.deltaY = o - qa.data.y, qa.data.y = o), Ea && (Ma.deltaX = n - qa.data.x, qa.data.x = n), qa.setRatio(1)) : (Fa && (Ma.deltaY = o - parseFloat(d.style.top || 0), d.style.top = o + "px"), Ea && (Ma.deltaY = n - parseFloat(d.style.left || 0), d.style.left = n + "px")), !v || a || ua || (ua = !0, ja(Ma, "drag", "onDrag"), ua = !1)
                            }
                            ba = !1
                        },
                        eb = function (a, c) {
                            var e, f = Ma.x,
                                g = Ma.y;
                            d._gsTransform || !ya && !za || b.set(d, {
                                x: "+=0",
                                overwrite: !1,
                                data: "_draggable"
                            }), ya ? (Ma.y = d._gsTransform.y, Ma.x = d._gsTransform.x) : za ? Ma.x = Ma.rotation = d._gsTransform.rotation : i ? (Ma.y = i.top(), Ma.x = i.left()) : (Ma.y = parseInt(d.style.top, 10) || 0, Ma.x = parseInt(d.style.left, 10) || 0), (ea || fa || ga) && !c && (Ma.isDragging || Ma.isThrowing) && (ga && (L.x = Ma.x, L.y = Ma.y, e = ga(L), e.x !== Ma.x && (Ma.x = e.x, ba = !0), e.y !== Ma.y && (Ma.y = e.y, ba = !0)), ea && (e = ea(Ma.x), e !== Ma.x && (Ma.x = e, za && (Ma.rotation = e), ba = !0)), fa && (e = fa(Ma.y), e !== Ma.y && (Ma.y = e), ba = !0)), ba && db(!0), a || (Ma.deltaX = Ma.x - f, Ma.deltaY = Ma.y - g, ja(Ma, "throwupdate", "onThrowUpdate"))
                        },
                        fb = function () {
                            var a, b, c, e;
                            s = !1, i ? (i.calibrate(), Ma.minX = y = -i.maxScrollLeft(), Ma.minY = H = -i.maxScrollTop(), Ma.maxX = w = Ma.maxY = E = 0, s = !0) : g.bounds && (a = ka(g.bounds, d.parentNode), za ? (Ma.minX = y = a.left, Ma.maxX = w = a.left + a.width, Ma.minY = H = Ma.maxY = E = 0) : void 0 !== g.bounds.maxX || void 0 !== g.bounds.maxY ? (a = g.bounds, Ma.minX = y = a.minX, Ma.minY = H = a.minY, Ma.maxX = w = a.maxX, Ma.maxY = E = a.maxY) : (b = ka(d, d.parentNode), Ma.minX = y = ia(d, Aa) + a.left - b.left, Ma.minY = H = ia(d, Da) + a.top - b.top, Ma.maxX = w = y + (a.width - b.width), Ma.maxY = E = H + (a.height - b.height)), y > w && (Ma.minX = w, Ma.maxX = w = y, y = Ma.minX), H > E && (Ma.minY = E, Ma.maxY = E = H, H = Ma.minY), za && (Ma.minRotation = y, Ma.maxRotation = w), s = !0), g.liveSnap && (c = g.liveSnap === !0 ? g.snap || {} : g.liveSnap, e = c instanceof Array || "function" == typeof c, za ? (ea = nb(e ? c : c.rotation, y, w, 1), fa = null) : c.points ? ga = ob(e ? c : c.points, y, w, H, E, c.radius, i ? -1 : 1) : (Ea && (ea = nb(e ? c : c.x || c.left || c.scrollLeft, y, w, i ? -1 : 1)), Fa && (fa = nb(e ? c : c.y || c.top || c.scrollTop, H, E, i ? -1 : 1))))
                        },
                        gb = function () {
                            Ma.isThrowing = !1, ja(Ma, "throwcomplete", "onThrowComplete")
                        },
                        hb = function () {
                            Ma.isThrowing = !1
                        },
                        ib = function (a, b) {
                            var c, e, h, j;
                            a && f ? (a === !0 && (c = g.snap || g.liveSnap || {}, e = c instanceof Array || "function" == typeof c, a = {
                                resistance: (g.throwResistance || g.resistance || 1e3) / (za ? 10 : 1)
                            }, za ? a.rotation = Oa(Ma, e ? c : c.rotation, w, y, 1, b) : (Ea && (a[Aa] = Oa(Ma, e ? c : c.points || c.x || c.left || c.scrollLeft, w, y, i ? -1 : 1, b || "x" === Ma.lockedAxis)), Fa && (a[Da] = Oa(Ma, e ? c : c.points || c.y || c.top || c.scrollTop, E, H, i ? -1 : 1, b || "y" === Ma.lockedAxis)), (c.points || c instanceof Array && "object" == typeof c[0]) && (a.linkedProps = Aa + "," + Da, a.radius = c.radius))), Ma.isThrowing = !0, j = isNaN(g.overshootTolerance) ? 1 === g.edgeResistance ? 0 : 1 - Ma.edgeResistance + .2 : g.overshootTolerance, Ma.tween = h = f.to(i || d, {
                                throwProps: a,
                                data: "_draggable",
                                ease: g.ease || q.Power3.easeOut,
                                onComplete: gb,
                                onOverwrite: hb,
                                onUpdate: g.fastMode ? ja : eb,
                                onUpdateParams: g.fastMode ? [Ma, "onthrowupdate", "onThrowUpdate"] : c && c.radius ? [!1, !0] : x
                            }, isNaN(g.maxDuration) ? 2 : g.maxDuration, isNaN(g.minDuration) ? 0 === j || "object" == typeof a && a.resistance > 1e3 ? 0 : .5 : g.minDuration, j), g.fastMode || (i && (i._suspendTransforms = !0), h.render(h.duration(), !0, !0), eb(!0, !0), Ma.endX = Ma.x, Ma.endY = Ma.y, za && (Ma.endRotation = Ma.x), h.play(0), eb(!0, !0), i && (i._suspendTransforms = !1))) : s && Ma.applyBounds()
                        },
                        jb = function (a) {
                            var b, c, e, f, g, h, i, l, m, n = ma || [1, 0, 0, 1, 0, 0];
                            ma = Ba(d.parentNode, !0), a && Ma.isPressed && n.join(",") !== ma.join(",") && (b = n[0], c = n[1], e = n[2], f = n[3], g = n[4], h = n[5], i = b * f - c * e, l = j * (f / i) + k * (-e / i) + (e * h - f * g) / i, m = j * (-c / i) + k * (b / i) + -(b * h - c * g) / i, k = l * ma[1] + m * ma[3] + ma[5], j = l * ma[0] + m * ma[2] + ma[4]), ma[1] || ma[2] || 1 != ma[0] || 1 != ma[3] || 0 != ma[4] || 0 != ma[5] || (ma = null)
                        },
                        kb = function () {
                            var a = 1 - Ma.edgeResistance;
                            jb(!1), ma && (j = Ma.pointerX * ma[0] + Ma.pointerY * ma[2] + ma[4], k = Ma.pointerX * ma[1] + Ma.pointerY * ma[3] + ma[5]), ba && (rb(Ma.pointerX, Ma.pointerY), db(!0)), i ? (fb(), r = i.top(), l = i.left()) : (lb() ? (eb(!0, !0), fb()) : Ma.applyBounds(), za ? (Z = Ma.rotationOrigin = Ca(d, {
                                x: 0,
                                y: 0
                            }), eb(!0, !0), l = Ma.x, r = Ma.y = Math.atan2(Z.y - Ma.pointerY, Ma.pointerX - Z.x) * z) : (oa = d.parentNode ? d.parentNode.scrollTop || 0 : 0, pa = d.parentNode ? d.parentNode.scrollLeft || 0 : 0, r = ia(d, Da), l = ia(d, Aa))), s && a && (l > w ? l = w + (l - w) / a : y > l && (l = y - (y - l) / a), za || (r > E ? r = E + (r - E) / a : H > r && (r = H - (H - r) / a))), Ma.startX = l, Ma.startY = r
                        },
                        lb = function () {
                            return Ma.tween && Ma.tween.isActive()
                        },
                        mb = function () {
                            !D.parentNode || lb() || Ma.isDragging || D.parentNode.removeChild(D)
                        },
                        nb = function (a, b, c, d) {
                            return "function" == typeof a ? function (e) {
                                var f = Ma.isPressed ? 1 - Ma.edgeResistance : 1;
                                return a.call(Ma, e > c ? c + (e - c) * f : b > e ? b + (e - b) * f : e) * d
                            } : a instanceof Array ? function (d) {
                                for (var e, f, g = a.length, h = 0, i = A; --g > -1;) e = a[g], f = e - d, 0 > f && (f = -f), i > f && e >= b && c >= e && (h = g, i = f);
                                return a[h]
                            } : isNaN(a) ? function (a) {
                                return a
                            } : function () {
                                return a * d
                            }
                        },
                        ob = function (a, b, c, d, e, f, g) {
                            return f = f && A > f ? f * f : A, "function" == typeof a ? function (h) {
                                var i, j, k, l = Ma.isPressed ? 1 - Ma.edgeResistance : 1,
                                    m = h.x,
                                    n = h.y;
                                return h.x = m = m > c ? c + (m - c) * l : b > m ? b + (m - b) * l : m, h.y = n = n > e ? e + (n - e) * l : d > n ? d + (n - d) * l : n, i = a.call(Ma, h), i !== h && (h.x = i.x, h.y = i.y), 1 !== g && (h.x *= g, h.y *= g), A > f && (j = h.x - m, k = h.y - n, j * j + k * k > f && (h.x = m, h.y = n)), h
                            } : a instanceof Array ? function (b) {
                                for (var c, d, e, g, h = a.length, i = 0, j = A; --h > -1;) e = a[h], c = e.x - b.x, d = e.y - b.y, g = c * c + d * d, j > g && (i = h, j = g);
                                return f >= j ? a[i] : b
                            } : function (a) {
                                return a
                            }
                        },
                        pb = function (a, c) {
                            var e;
                            if (h && !Ma.isPressed && a && ("mousedown" !== a.type && "pointerdown" !== a.type || c || !(B() - bb < 30) || !Ia[Ma.pointerEvent.type])) {
                                if (na = lb(), Ma.pointerEvent = a, Ia[a.type] ? (la = -1 !== a.type.indexOf("touch") ? a.currentTarget || a.target : t, Ja(la, "touchend", sb), Ja(la, "touchmove", qb), Ja(la, "touchcancel", sb), Ja(t, "touchstart", Na)) : (la = null, Ja(t, "mousemove", qb)), sa = null, Ja(t, "mouseup", sb), a && a.target && Ja(a.target, "mouseup", sb), ha = ab.call(Ma, a.target) && !g.dragClickables && !c) return Ja(a.target, "change", sb), ja(Ma, "press", "onPress"), void Qa(Ra, !0);
                                if (ra = la && Ea !== Fa && Ma.vars.allowNativeTouchScrolling !== !1 ? Ea ? "y" : "x" : !1, C ? a = _(a, !0) : ra || Ma.allowEventDefault || (a.preventDefault(), a.preventManipulation && a.preventManipulation()), a.changedTouches ? (a = U = a.changedTouches[0], V = a.identifier) : a.pointerId ? V = a.pointerId : U = V = null, I++, Q(db), k = Ma.pointerY = a.pageY, j = Ma.pointerX = a.pageX, (ra || Ma.autoScroll) && $(d.parentNode), !d.parentNode || !Ma.autoScroll || i || za || !d.parentNode._gsMaxScrollX || D.parentNode || d.getBBox || (D.style.width = d.parentNode.scrollWidth + "px", d.parentNode.appendChild(D)), kb(), Ma.tween && Ma.tween.kill(), Ma.isThrowing = !1, b.killTweensOf(i || d, !0, Ua), i && b.killTweensOf(d, !0, {
                                        scrollTo: 1
                                    }), Ma.tween = Ma.lockedAxis = null, (g.zIndexBoost || !za && !i && g.zIndexBoost !== !1) && (d.style.zIndex = Ta.zIndex++), Ma.isPressed = !0, v = !(!g.onDrag && !Ma._listeners.drag), !za)
                                    for (e = Ra.length; --e > -1;) ca(Ra[e], "cursor", g.cursor || "move");
                                ja(Ma, "press", "onPress")
                            }
                        },
                        qb = function (a) {
                            var b, c, d, f, g, i, l = a;
                            if (h && !e && Ma.isPressed && a) {
                                if (Ma.pointerEvent = a, b = a.changedTouches) {
                                    if (a = b[0], a !== U && a.identifier !== V) {
                                        for (f = b.length; --f > -1 && (a = b[f]).identifier !== V;);
                                        if (0 > f) return
                                    }
                                } else if (a.pointerId && V && a.pointerId !== V) return;
                                if (C) a = _(a, !0);
                                else {
                                    if (la && ra && !sa && (c = a.pageX, d = a.pageY, ma && (f = c * ma[0] + d * ma[2] + ma[4], d = c * ma[1] + d * ma[3] + ma[5], c = f), g = Math.abs(c - j), i = Math.abs(d - k), (g !== i && (g > Ga || i > Ga) || J && ra === sa) && (sa = g > i && Ea ? "x" : "y", Ma.vars.lockAxisOnTouchScroll !== !1 && (Ma.lockedAxis = "x" === sa ? "y" : "x", "function" == typeof Ma.vars.onLockAxis && Ma.vars.onLockAxis.call(Ma, l)), J && ra === sa))) return void sb(l);
                                    Ma.allowEventDefault || ra && (!sa || ra === sa) || l.cancelable === !1 || (l.preventDefault(), l.preventManipulation && l.preventManipulation())
                                }
                                Ma.autoScroll && (Wa = !0), rb(a.pageX, a.pageY)
                            }
                        },
                        rb = function (a, b) {
                            var c, d, e, f, g, h, i = 1 - Ma.dragResistance,
                                m = 1 - Ma.edgeResistance;
                            Ma.pointerX = a, Ma.pointerY = b, za ? (f = Math.atan2(Z.y - b, a - Z.x) * z, g = Ma.y - f, g > 180 ? (r -= 360, Ma.y = f) : -180 > g && (r += 360, Ma.y = f), Ma.x !== l || Math.abs(r - f) > Ga ? (Ma.y = f, e = l + (r - f) * i) : e = l) : (ma && (h = a * ma[0] + b * ma[2] + ma[4], b = a * ma[1] + b * ma[3] + ma[5], a = h), d = b - k, c = a - j, Ga > d && d > -Ga && (d = 0), Ga > c && c > -Ga && (c = 0), (Ma.lockAxis || Ma.lockedAxis) && (c || d) && (h = Ma.lockedAxis, h || (Ma.lockedAxis = h = Ea && Math.abs(c) > Math.abs(d) ? "y" : Fa ? "x" : null, h && "function" == typeof Ma.vars.onLockAxis && Ma.vars.onLockAxis.call(Ma, Ma.pointerEvent)), "y" === h ? d = 0 : "x" === h && (c = 0)), e = l + c * i, f = r + d * i), (ea || fa || ga) && (Ma.x !== e || Ma.y !== f && !za) ? (ga && (L.x = e, L.y = f, h = ga(L), e = h.x, f = h.y), ea && (e = ea(e)), fa && (f = fa(f))) : s && (e > w ? e = w + (e - w) * m : y > e && (e = y + (e - y) * m), za || (f > E ? f = E + (f - E) * m : H > f && (f = H + (f - H) * m))), za || ma || (e = Math.round(e), f = Math.round(f)), (Ma.x !== e || Ma.y !== f && !za) && (za ? (Ma.endRotation = Ma.x = Ma.endX = e, ba = !0) : (Fa && (Ma.y = Ma.endY = f, ba = !0), Ea && (Ma.x = Ma.endX = e, ba = !0)), !Ma.isDragging && Ma.isPressed && (Ma.isDragging = !0, ja(Ma, "dragstart", "onDragStart")))
                        },
                        sb = function (a, c) {
                            if (h && Ma.isPressed && (!a || null == V || c || !(a.pointerId && a.pointerId !== V || a.changedTouches && !La(a.changedTouches, V)))) {
                                Ma.isPressed = !1;
                                var e, f, i, j, k, l = a,
                                    m = Ma.isDragging,
                                    n = b.delayedCall(.001, mb);
                                if (la ? (Ka(la, "touchend", sb), Ka(la, "touchmove", qb), Ka(la, "touchcancel", sb), Ka(t, "touchstart", Na)) : Ka(t, "mousemove", qb), Ka(t, "mouseup", sb), a && a.target && Ka(a.target, "mouseup", sb), ba = !1, ha) return a && (Ka(a.target, "change", sb), Ma.pointerEvent = l), Qa(Ra, !1), ja(Ma, "release", "onRelease"), ja(Ma, "click", "onClick"), void(ha = !1);
                                if (R(db), !za)
                                    for (f = Ra.length; --f > -1;) ca(Ra[f], "cursor", g.cursor || "move");
                                if (m && (Va = K = B(), Ma.isDragging = !1), I--, a) {
                                    if (C && (a = _(a, !1)), e = a.changedTouches, e && (a = e[0], a !== U && a.identifier !== V)) {
                                        for (f = e.length; --f > -1 && (a = e[f]).identifier !== V;);
                                        if (0 > f) return
                                    }
                                    Ma.pointerEvent = l, Ma.pointerX = a.pageX, Ma.pointerY = a.pageY
                                }
                                return l && !m ? (na && (g.snap || g.bounds) && ib(g.throwProps), ja(Ma, "release", "onRelease"), J && "touchmove" === l.type || -1 !== l.type.indexOf("cancel") || (ja(Ma, "click", "onClick"), B() - bb < 300 && ja(Ma, "doubleclick", "onDoubleClick"), j = l.target || l.srcElement || d, bb = B(), k = function () {
                                    bb !== va && Ma.enabled() && !Ma.isPressed && (j.click ? j.click() : t.createEvent && (i = t.createEvent("MouseEvents"), i.initMouseEvent("click", !0, !0, window, 1, Ma.pointerEvent.screenX, Ma.pointerEvent.screenY, Ma.pointerX, Ma.pointerY, !1, !1, !1, !1, 0, null), j.dispatchEvent(i)))
                                }, J || l.defaultPrevented || b.delayedCall(1e-5, k))) : (ib(g.throwProps), C || Ma.allowEventDefault || !l || !g.dragClickables && ab.call(Ma, l.target) || !m || ra && (!sa || ra !== sa) || l.cancelable === !1 || (l.preventDefault(), l.preventManipulation && l.preventManipulation()), ja(Ma, "release", "onRelease")), lb() && n.duration(Ma.tween.duration()), m && ja(Ma, "dragend", "onDragEnd"), !0
                            }
                        },
                        tb = function (a) {
                            if (a && Ma.isDragging && !i) {
                                var b = a.target || a.srcElement || d.parentNode,
                                    c = b.scrollLeft - b._gsScrollX,
                                    e = b.scrollTop - b._gsScrollY;
                                (c || e) && (ma ? (j -= c * ma[0] + e * ma[2], k -= e * ma[3] + c * ma[1]) : (j -= c, k -= e), b._gsScrollX += c, b._gsScrollY += e, rb(Ma.pointerX, Ma.pointerY))
                            }
                        },
                        ub = function (a) {
                            var b = B(),
                                c = 40 > b - bb,
                                d = 40 > b - Va,
                                e = c && va === bb,
                                f = !!a.preventDefault,
                                g = Ma.pointerEvent && Ma.pointerEvent.defaultPrevented,
                                h = c && wa === bb,
                                i = a.isTrusted || null == a.isTrusted && c && e;
                            return f && (e || d && Ma.vars.suppressClickOnDrag !== !1) && a.stopImmediatePropagation(), !c || Ma.pointerEvent && Ma.pointerEvent.defaultPrevented || e && i === h ? void((Ma.isPressed || d || c) && (f ? i && a.detail && c && !g || (a.preventDefault(), a.preventManipulation && a.preventManipulation()) : a.returnValue = !1)) : (i && e && (wa = bb), void(va = bb))
                        },
                        vb = function (a) {
                            return ma ? {
                                x: a.x * ma[0] + a.y * ma[2] + ma[4],
                                y: a.x * ma[1] + a.y * ma[3] + ma[5]
                            } : {
                                x: a.x,
                                y: a.y
                            }
                        };
                    da = Ta.get(this.target), da && da.kill(), this.startDrag = function (a, b) {
                        var c, e, f, g;
                        pb(a || Ma.pointerEvent, !0), b && !Ma.hitTest(a || Ma.pointerEvent) && (c = Xa(a || Ma.pointerEvent), e = Xa(d), f = vb({
                            x: c.left + c.width / 2,
                            y: c.top + c.height / 2
                        }), g = vb({
                            x: e.left + e.width / 2,
                            y: e.top + e.height / 2
                        }), j -= f.x - g.x, k -= f.y - g.y), Ma.isDragging || (Ma.isDragging = !0,
                            ja(Ma, "dragstart", "onDragStart"))
                    }, this.drag = qb, this.endDrag = function (a) {
                        sb(a || Ma.pointerEvent, !0)
                    }, this.timeSinceDrag = function () {
                        return Ma.isDragging ? 0 : (B() - Va) / 1e3
                    }, this.timeSinceClick = function () {
                        return (B() - bb) / 1e3
                    }, this.hitTest = function (a, b) {
                        return Ta.hitTest(Ma.target, a, b)
                    }, this.getDirection = function (a, b) {
                        var c, d, e, g, h, i, j = "velocity" === a && f ? a : "object" != typeof a || za ? "start" : "element";
                        return "element" === j && (h = Xa(Ma.target), i = Xa(a)), c = "start" === j ? Ma.x - l : "velocity" === j ? f.getVelocity(this.target, Aa) : h.left + h.width / 2 - (i.left + i.width / 2), za ? 0 > c ? "counter-clockwise" : "clockwise" : (b = b || 2, d = "start" === j ? Ma.y - r : "velocity" === j ? f.getVelocity(this.target, Da) : h.top + h.height / 2 - (i.top + i.height / 2), e = Math.abs(c / d), g = 1 / b > e ? "" : 0 > c ? "left" : "right", b > e && ("" !== g && (g += "-"), g += 0 > d ? "up" : "down"), g)
                    }, this.applyBounds = function (a) {
                        var b, c, e, f, h, i;
                        if (a && g.bounds !== a) return g.bounds = a, Ma.update(!0);
                        if (eb(!0), fb(), s) {
                            if (b = Ma.x, c = Ma.y, b > w ? b = w : y > b && (b = y), c > E ? c = E : H > c && (c = H), (Ma.x !== b || Ma.y !== c) && (e = !0, Ma.x = Ma.endX = b, za ? Ma.endRotation = b : Ma.y = Ma.endY = c, ba = !0, db(!0), Ma.autoScroll && !Ma.isDragging))
                                for ($(d.parentNode), f = d, M.scrollTop = null != window.pageYOffset ? window.pageYOffset : null != u.scrollTop ? u.scrollTop : t.body.scrollTop, M.scrollLeft = null != window.pageXOffset ? window.pageXOffset : null != u.scrollLeft ? u.scrollLeft : t.body.scrollLeft; f && !i;) i = Y(f.parentNode), h = i ? M : f.parentNode, Fa && h.scrollTop > h._gsMaxScrollY && (h.scrollTop = h._gsMaxScrollY), Ea && h.scrollLeft > h._gsMaxScrollX && (h.scrollLeft = h._gsMaxScrollX), f = h;
                            Ma.isThrowing && (e || Ma.endX > w || Ma.endX < y || Ma.endY > E || Ma.endY < H) && ib(g.throwProps, e)
                        }
                        return Ma
                    }, this.update = function (a, b, c) {
                        var e = Ma.x,
                            f = Ma.y;
                        return jb(!b), a ? Ma.applyBounds() : (ba && c && db(!0), eb(!0)), b && (rb(Ma.pointerX, Ma.pointerY), ba && db(!0)), Ma.isPressed && !b && (Ea && Math.abs(e - Ma.x) > .01 || Fa && Math.abs(f - Ma.y) > .01 && !za) && kb(), Ma.autoScroll && ($(d.parentNode), Wa = Ma.isDragging, db(!0)), Ma.autoScroll && (X(d, tb), W(d, tb)), Ma
                    }, this.enable = function (a) {
                        var e, j, k;
                        if ("soft" !== a) {
                            for (j = Ra.length; --j > -1;) k = Ra[j], Ja(k, "mousedown", pb), Ja(k, "touchstart", pb), Ja(k, "click", ub, !0), za || ca(k, "cursor", g.cursor || "move"), ca(k, "touchCallout", "none"), ca(k, "touchAction", Ea === Fa ? "none" : Ea ? "pan-y" : "pan-x"), ta(k) && ca(k.ownerSVGElement || k, "touchAction", Ea === Fa ? "none" : Ea ? "pan-y" : "pan-x"), this.vars.allowContextMenu || Ja(k, "contextmenu", cb);
                            Qa(Ra, !1)
                        }
                        return W(d, tb), h = !0, f && "soft" !== a && f.track(i || d, ya ? "x,y" : za ? "rotation" : "top,left"), i && i.enable(), d._gsDragID = e = "d" + G++, F[e] = this, i && (i.element._gsDragID = e), b.set(d, {
                            x: "+=0",
                            overwrite: !1,
                            data: "_draggable"
                        }), qa = {
                            t: d,
                            data: C ? S : d._gsTransform,
                            tween: {},
                            setRatio: C ? function () {
                                b.set(d, P)
                            } : c._internals.setTransformRatio || c._internals.set3DTransformRatio
                        }, kb(), Ma.update(!0), Ma
                    }, this.disable = function (a) {
                        var b, c, e = Ma.isDragging;
                        if (!za)
                            for (b = Ra.length; --b > -1;) ca(Ra[b], "cursor", null);
                        if ("soft" !== a) {
                            for (b = Ra.length; --b > -1;) c = Ra[b], ca(c, "touchCallout", null), ca(c, "touchAction", null), Ka(c, "mousedown", pb), Ka(c, "touchstart", pb), Ka(c, "click", ub), Ka(c, "contextmenu", cb);
                            Qa(Ra, !0), la && (Ka(la, "touchcancel", sb), Ka(la, "touchend", sb), Ka(la, "touchmove", qb)), Ka(t, "mouseup", sb), Ka(t, "mousemove", qb)
                        }
                        return X(d, tb), h = !1, f && "soft" !== a && f.untrack(i || d, ya ? "x,y" : za ? "rotation" : "top,left"), i && i.disable(), R(db), Ma.isDragging = Ma.isPressed = ha = !1, e && ja(Ma, "dragend", "onDragEnd"), Ma
                    }, this.enabled = function (a, b) {
                        return arguments.length ? a ? Ma.enable(b) : Ma.disable(b) : h
                    }, this.kill = function () {
                        return Ma.isThrowing = !1, b.killTweensOf(i || d, !0, Ua), Ma.disable(), delete F[d._gsDragID], Ma
                    }, -1 !== xa.indexOf("scroll") && (i = this.scrollProxy = new Sa(d, T({
                        onKill: function () {
                            Ma.isPressed && sb(null)
                        }
                    }, g)), d.style.overflowY = Fa && !Ha ? "auto" : "hidden", d.style.overflowX = Ea && !Ha ? "auto" : "hidden", d = i.content), g.force3D !== !1 && b.set(d, {
                        force3D: !0
                    }), za ? Ua.rotation = 1 : (Ea && (Ua[Aa] = 1), Fa && (Ua[Da] = 1)), za ? (P = p, S = P.css, P.overwrite = !1) : ya && (P = Ea && Fa ? m : Ea ? n : o, S = P.css, P.overwrite = !1), this.enable()
                },
                Ua = Ta.prototype = new a;
            Ua.constructor = Ta, Ua.pointerX = Ua.pointerY = Ua.startX = Ua.startY = Ua.deltaX = Ua.deltaY = 0, Ua.isDragging = Ua.isPressed = !1, Ta.version = "0.16.1", Ta.zIndex = 1e3, Ja(t, "touchcancel", function () {}), Ja(t, "contextmenu", function (a) {
                var b;
                for (b in F) F[b].isPressed && F[b].endDrag()
            }), Ta.create = function (a, c) {
                "string" == typeof a && (a = b.selector(a));
                for (var d = a && 0 !== a.length ? Fa(a) ? Ga(a) : [a] : [], e = d.length; --e > -1;) d[e] = new Ta(d[e], c);
                return d
            }, Ta.get = function (a) {
                return F[(aa(a) || {})._gsDragID]
            }, Ta.timeSinceDrag = function () {
                return (B() - K) / 1e3
            };
            var Va = {},
                Wa = function (a) {
                    var b, c, d = 0,
                        e = 0;
                    for (a = aa(a), b = a.offsetWidth, c = a.offsetHeight; a;) d += a.offsetTop, e += a.offsetLeft, a = a.offsetParent;
                    return {
                        top: d,
                        left: e,
                        width: b,
                        height: c
                    }
                },
                Xa = function (a, b) {
                    if (a === window) return Va.left = Va.top = 0, Va.width = Va.right = u.clientWidth || a.innerWidth || t.body.clientWidth || 0, Va.height = Va.bottom = (a.innerHeight || 0) - 20 < u.clientHeight ? u.clientHeight : a.innerHeight || t.body.clientHeight || 0, Va;
                    var c = a.pageX !== b ? {
                        left: a.pageX - V(),
                        top: a.pageY - U(),
                        right: a.pageX - V() + 1,
                        bottom: a.pageY - U() + 1
                    } : a.nodeType || a.left === b || a.top === b ? C ? Wa(a) : aa(a).getBoundingClientRect() : a;
                    return c.right === b && c.width !== b ? (c.right = c.left + c.width, c.bottom = c.top + c.height) : c.width === b && (c = {
                        width: c.right - c.left,
                        height: c.bottom - c.top,
                        right: c.right,
                        left: c.left,
                        bottom: c.bottom,
                        top: c.top
                    }), c
                };
            return Ta.hitTest = function (a, b, c) {
                if (a === b) return !1;
                var d, e, f, g = Xa(a),
                    h = Xa(b),
                    i = h.left > g.right || h.right < g.left || h.top > g.bottom || h.bottom < g.top;
                return i || !c ? !i : (f = -1 !== (c + "").indexOf("%"), c = parseFloat(c) || 0, d = {
                    left: Math.max(g.left, h.left),
                    top: Math.max(g.top, h.top)
                }, d.width = Math.min(g.right, h.right) - d.left, d.height = Math.min(g.bottom, h.bottom) - d.top, d.width < 0 || d.height < 0 ? !1 : f ? (c *= .01, e = d.width * d.height, e >= g.width * g.height * c || e >= h.width * h.height * c) : d.width > c && d.height > c)
            }, D.style.cssText = "visibility:hidden;height:1px;top:-1px;pointer-events:none;position:relative;clear:both;", Ta
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function (a) {
        "use strict";
        var b = function () {
            return (_gsScope.GreenSockGlobals || _gsScope)[a]
        };
        "undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), require("../plugins/CSSPlugin.min.js"), module.exports = b()) : "function" == typeof define && define.amd && define(["TweenLite", "CSSPlugin"], b)
    }("Draggable");