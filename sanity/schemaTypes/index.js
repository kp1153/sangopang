import MultiImageInput from "./MultiImageInput";
import CloudinaryImageInput from "./CloudinaryImageInput";

function hindiToRoman(input) {
  if (!input) return "";

  const consonants = {
    क: "k",
    ख: "kh",
    ग: "g",
    घ: "gh",
    ङ: "ng",
    च: "ch",
    छ: "chh",
    ज: "j",
    झ: "jh",
    ञ: "ny",
    ट: "t",
    ठ: "th",
    ड: "d",
    ढ: "dh",
    ण: "n",
    त: "t",
    थ: "th",
    द: "d",
    ध: "dh",
    न: "n",
    प: "p",
    फ: "ph",
    ब: "b",
    भ: "bh",
    म: "m",
    य: "y",
    र: "r",
    ल: "l",
    व: "v",
    ळ: "l",
    श: "sh",
    ष: "sh",
    स: "s",
    ह: "h",
    क्ष: "ksh",
    त्र: "tr",
    ज्ञ: "gya",
  };

  const vowels = {
    अ: "a",
    आ: "aa",
    इ: "i",
    ई: "ee",
    उ: "u",
    ऊ: "oo",
    ऋ: "ri",
    ए: "e",
    ऐ: "ai",
    ओ: "o",
    औ: "au",
  };

  const matras = {
    "ा": "aa",
    "ि": "i",
    "ी": "ee",
    "ु": "u",
    "ू": "oo",
    "ृ": "ri",
    "े": "e",
    "ै": "ai",
    "ो": "o",
    "ौ": "au",
  };

  const specials = {
    "ं": "n",
    "ः": "h",
    "ँ": "n",
    "्": "",
  };

  const dict = {
    में: "mein",
    की: "ki",
    का: "ka",
    के: "ke",
    और: "aur",
    से: "se",
    पर: "par",
    है: "hai",
    हुई: "hui",
    हुआ: "hua",
    को: "ko",
    ने: "ne",
    एक: "ek",
    यह: "yah",
    वह: "vah",
    था: "tha",
    थी: "thi",
    हैं: "hain",
    हो: "ho",
    गया: "gaya",
    गई: "gayi",
    दिया: "diya",
    लिया: "liya",
  };

  const cleaned = input
    .trim()
    .replace(/[।!?,.]/g, "")
    .replace(/[\u0964\u0965]/g, "")
    .replace(/\s+/g, " ");

  const words = cleaned.split(" ");
  const transliteratedWords = [];

  for (let word of words) {
    word = word.trim();
    if (!word) continue;

    const lowerWord = word.toLowerCase();
    if (dict[lowerWord]) {
      transliteratedWords.push(dict[lowerWord]);
      continue;
    }

    let result = "";
    let i = 0;

    while (i < word.length) {
      const char = word[i];
      const nextChar = word[i + 1];
      const twoChar = char + nextChar;

      if (consonants[twoChar]) {
        result += consonants[twoChar];
        i += 2;
        continue;
      }

      if (vowels[char]) {
        result += vowels[char];
        i++;
        continue;
      }

      if (consonants[char]) {
        result += consonants[char];

        if (matras[nextChar]) {
          result += matras[nextChar];
          i += 2;
          continue;
        } else if (nextChar === "्") {
          i += 2;
          continue;
        } else if (nextChar && !consonants[nextChar] && !vowels[nextChar]) {
          i++;
          continue;
        } else {
          result += "a";
          i++;
          continue;
        }
      }

      if (specials[char] !== undefined) {
        result += specials[char];
        i++;
        continue;
      }

      if (/[a-zA-Z0-9]/.test(char)) {
        result += char.toLowerCase();
        i++;
        continue;
      }

      i++;
    }

    if (result) {
      transliteratedWords.push(result);
    }
  }

  return transliteratedWords.join("-");
}

export const schema = {
  types: [
    {
      name: "category",
      title: "श्रेणी (Category)",
      type: "document",
      fields: [
        {
          name: "name",
          title: "श्रेणी का नाम",
          type: "string",
          validation: (Rule) =>
            Rule.required().error("श्रेणी का नाम आवश्यक है"),
        },
        {
          name: "slug",
          title: "URL Slug",
          type: "slug",
          options: {
            source: "name",
            maxLength: 96,
            slugify: (input) => {
              const romanized = hindiToRoman(input);
              const timePart = new Date()
                .toISOString()
                .replace(/[-:.TZ]/g, "")
                .slice(0, 14);
              return `${romanized}-${timePart}`;
            },
          },
          validation: (Rule) => Rule.required().error("Slug आवश्यक है"),
        },
      ],
      preview: {
        select: {
          title: "name",
          subtitle: "slug.current",
        },
      },
    },

    {
      name: "post",
      title: "समाचार (Post)",
      type: "document",
      fields: [
        {
          name: "title",
          title: "शीर्षक",
          type: "string",
          validation: (Rule) =>
            Rule.required()
              .min(10)
              .max(200)
              .error("शीर्षक 10-200 अक्षरों के बीच होना चाहिए"),
        },
        {
          name: "slug",
          title: "URL Slug",
          type: "slug",
          options: {
            source: "title",
            maxLength: 96,
            slugify: (input) => {
              const romanized = hindiToRoman(input);
              const timePart = new Date()
                .toISOString()
                .replace(/[-:.TZ]/g, "")
                .slice(0, 14);
              return `${romanized}-${timePart}`;
            },
          },
          validation: (Rule) => Rule.required().error("URL Slug आवश्यक है"),
        },
        {
          name: "content",
          title: "सामग्री",
          type: "blockContent",
          validation: (Rule) => Rule.required().error("सामग्री आवश्यक है"),
        },
        {
          name: "mainImage",
          title: "मुख्य तस्वीर (Cloudinary URL)",
          type: "string",
          components: {
            input: CloudinaryImageInput,
          },
        },
        {
          name: "mainImageCaption",
          title: "मुख्य तस्वीर कैप्शन",
          type: "string",
        },
        {
          name: "publishedAt",
          title: "प्रकाशन तारीख",
          type: "datetime",
          initialValue: () => new Date().toISOString(),
          validation: (Rule) =>
            Rule.required().error("प्रकाशन तारीख आवश्यक है"),
        },
        {
          name: "category",
          title: "श्रेणी",
          type: "reference",
          to: [{ type: "category" }],
          validation: (Rule) =>
            Rule.required().error("श्रेणी का चुनाव आवश्यक है"),
        },
        {
          name: "videoLink",
          title: "वीडियो लिंक",
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        },
        {
          name: "views",
          title: "Views Count",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.min(0),
        },
      ],
      orderings: [
        {
          title: "प्रकाशन तारीख के अनुसार (नया पहले)",
          name: "publishedAtDesc",
          by: [{ field: "publishedAt", direction: "desc" }],
        },
        {
          title: "शीर्षक के अनुसार",
          name: "titleAsc",
          by: [{ field: "title", direction: "asc" }],
        },
      ],
      preview: {
        select: {
          title: "title",
          media: "mainImage",
          category: "category.name",
          publishedAt: "publishedAt",
        },
        prepare(selection) {
          const { title, category, publishedAt } = selection;
          const formattedDate = publishedAt
            ? new Date(publishedAt).toLocaleDateString("hi-IN")
            : "तारीख नहीं";
          return {
            title,
            subtitle: `${category || "बिना श्रेणी"} • ${formattedDate}`,
          };
        },
      },
    },

    {
      name: "blockContent",
      title: "Block Content",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [
            { title: "सामान्य", value: "normal" },
            { title: "शीर्षक 1", value: "h1" },
            { title: "शीर्षक 2", value: "h2" },
            { title: "शीर्षक 3", value: "h3" },
            { title: "उद्धरण", value: "blockquote" },
          ],
          lists: [
            { title: "बुलेट पॉइंट", value: "bullet" },
            { title: "संख्या सूची", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "मोटा (Bold)", value: "strong" },
              { title: "तिरछा (Italic)", value: "em" },
              { title: "अंडरलाइन", value: "underline" },
              { title: "पिंक", value: "pink" },
            ],
            annotations: [
              {
                title: "लिंक",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                  {
                    title: "नई विंडो में खोलें",
                    name: "blank",
                    type: "boolean",
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: "object",
          name: "cloudinaryImage",
          title: "तस्वीर (Cloudinary)",
          fields: [
            {
              name: "url",
              title: "Image URL",
              type: "string",
              components: {
                input: CloudinaryImageInput,
              },
            },
            {
              name: "caption",
              title: "कैप्शन",
              type: "string",
            },
          ],
        },
        {
          type: "object",
          name: "gallery",
          title: "फोटो गैलरी",
          fields: [
            {
              name: "images",
              title: "तस्वीरें",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "galleryImage",
                  fields: [
                    {
                      name: "url",
                      title: "Image URL",
                      type: "string",
                    },
                    {
                      name: "alt",
                      title: "Alt Text",
                      type: "string",
                    },
                  ],
                },
              ],
              components: {
                input: MultiImageInput,
              },
              validation: (Rule) =>
                Rule.min(1).error("कम से कम एक तस्वीर जोड़ें"),
            },
          ],
        },

        {
          type: "object",
          name: "youtube",
          title: "YouTube Video",
          fields: [
            {
              name: "url",
              title: "YouTube URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({ scheme: ["http", "https"] }),
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
        },

        {
          type: "object",
          name: "break",
          title: "पेज ब्रेक",
          fields: [
            {
              name: "style",
              type: "string",
              options: { list: ["break", "line"] },
            },
          ],
        },
      ],
    },
  ],
};
