import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4",
  "ul", "ol", "li", "a", "blockquote", "span", "div",
  "img", "figure", "figcaption", "hr",
];

const ALLOWED_ATTR = [
  "href", "target", "rel", "class", "src", "alt", "title",
  "width", "height", "loading",
];

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    // تحويل المصفوفة إلى الشكل الذي تفهمه المكتبة الجديدة للمطابقة
    allowedAttributes: ALLOWED_ATTR.reduce((acc, attr) => {
      acc[attr] = [attr]; // السماح بالخاصية لأي تاغ يمتلكها
      return acc;
    }, {
      // إعدادات افتراضية مخصصة للروابط والصور لضمان الأمان وحمايتها
      'a': ['href', 'name', 'target', 'rel', 'class'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
      '*': ['class', 'style'] // السماح بالـ class والـ style في كل التاغات
    } as Record<string, string[]>),
    
    // فلترة الروابط (نفس الـ Regexp الخاص بك للتأكد من أمان المسارات)
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto'],
      img: ['http', 'https']
    },
    exclusiveFilter: (frame) => {
      // حماية إضافية للروابط والصور المحلية/الخارجية كما كنت تفعل
      if (frame.tag === 'img' && frame.attribs.src) {
        const src = frame.attribs.src;
        return !src.startsWith('/uploads/') && !/^https?:\/\//i.test(src);
      }
      if (frame.tag === 'a' && frame.attribs.href) {
        const href = frame.attribs.href;
        return !href.startsWith('/') && !/^https?:\/\//i.test(href);
      }
      return false;
    }
  });
}

// دالة لتجريد النص من أي تاغات HTML تماماً
export function stripHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [],
    allowedAttributes: {}
  });
}

// دالة تحويل الحروف الخاصة لمنع الـ XSS يدويًا
export function escapeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}