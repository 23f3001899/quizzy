const QUESTIONS = [
  // HTML — Easy
  { id: 1,  topic: "HTML", difficulty: "easy",   question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlinking Text Mark Language"], correctAnswer: 0 },
  { id: 2,  topic: "HTML", difficulty: "easy",   question: "Which tag is used to create a hyperlink in HTML?", options: ["a", "link", "href", "hyper"], correctAnswer: 0 },
  { id: 3,  topic: "HTML", difficulty: "easy",   question: "Which attribute is used to provide an alternate text for an image?", options: ["alt", "src", "title", "href"], correctAnswer: 0 },
  { id: 4,  topic: "HTML", difficulty: "easy",   question: "What is the correct HTML element for inserting a line break?", options: ["break", "br", "lb", "line"], correctAnswer: 1 },
  { id: 5,  topic: "HTML", difficulty: "easy",   question: "Which tag defines the largest heading?", options: ["heading", "h6", "h1", "head"], correctAnswer: 2 },
  // HTML — Medium
  { id: 6,  topic: "HTML", difficulty: "medium", question: "Which tag is used to define an HTML document's metadata?", options: ["head", "meta", "footer", "header"], correctAnswer: 1 },
  { id: 7,  topic: "HTML", difficulty: "medium", question: "Which tag displays an unordered list?", options: ["ul", "ol", "list", "ulist"], correctAnswer: 0 },
  { id: 8,  topic: "HTML", difficulty: "medium", question: "Which tag is used to insert an image in HTML?", options: ["image", "img", "src", "photo"], correctAnswer: 1 },
  { id: 9,  topic: "HTML", difficulty: "medium", question: "Which attribute specifies the URL a link goes to?", options: ["href", "src", "url", "path"], correctAnswer: 0 },
  // HTML — Hard
  { id: 28, topic: "HTML", difficulty: "hard",   question: "Which HTML5 element is used to define navigation links?", options: ["nav", "section", "aside", "article"], correctAnswer: 0 },
  { id: 29, topic: "HTML", difficulty: "hard",   question: "What is the correct way to make a number input that only accepts values between 1 and 10?", options: ['<input type="number" min="1" max="10">', '<input type="number" range="1-10">', '<input type="range" min="1" max="10">', '<input type="number" from="1" to="10">'], correctAnswer: 0 },
  { id: 30, topic: "HTML", difficulty: "hard",   question: "Which attribute makes a form field required before submission?", options: ["required", "mandatory", "validate", "must"], correctAnswer: 0 },

  // CSS — Easy
  { id: 10, topic: "CSS",  difficulty: "easy",   question: "Which property changes the background color?", options: ["color", "background-color", "bgcolor", "background"], correctAnswer: 1 },
  { id: 11, topic: "CSS",  difficulty: "easy",   question: "How do you select an element with id 'demo'?", options: [".demo", "#demo", "demo", "*demo"], correctAnswer: 1 },
  { id: 12, topic: "CSS",  difficulty: "easy",   question: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], correctAnswer: 2 },
  { id: 15, topic: "CSS",  difficulty: "easy",   question: "Which property changes the font color?", options: ["font-color", "color", "text-color", "background-color"], correctAnswer: 1 },
  // CSS — Medium
  { id: 13, topic: "CSS",  difficulty: "medium", question: "How do you capitalize the first letter of every word?", options: ["text-transform: capitalize;", "text-style: capitalize;", "transform: capitalize;", "font-transform: capitalize;"], correctAnswer: 0 },
  { id: 14, topic: "CSS",  difficulty: "medium", question: "Which property changes the left margin of an element?", options: ["padding-left", "margin-left", "indent", "margin"], correctAnswer: 1 },
  { id: 16, topic: "CSS",  difficulty: "medium", question: "How do you select ALL p elements in CSS?", options: ["#p", ".p", "p", "all p"], correctAnswer: 2 },
  { id: 17, topic: "CSS",  difficulty: "medium", question: "Which property adds space INSIDE an element?", options: ["margin", "border", "padding", "spacing"], correctAnswer: 2 },
  { id: 18, topic: "CSS",  difficulty: "medium", question: "How do you make text bold in CSS?", options: ["font-weight: bold;", "font-style: bold;", "font: bold;", "text-style: bold;"], correctAnswer: 0 },
  // CSS — Hard
  { id: 31, topic: "CSS",  difficulty: "hard",   question: "Which CSS property creates a flexible container?", options: ["display: flex", "display: grid", "display: block", "display: inline"], correctAnswer: 0 },
  { id: 32, topic: "CSS",  difficulty: "hard",   question: "What does 'z-index' control?", options: ["Stacking order of elements", "Zoom level", "Font size", "Transparency"], correctAnswer: 0 },
  { id: 33, topic: "CSS",  difficulty: "hard",   question: "Which unit is relative to the viewport width?", options: ["vw", "em", "px", "rem"], correctAnswer: 0 },

  // JavaScript — Easy
  { id: 19, topic: "JavaScript", difficulty: "easy",   question: "Which symbol is used for single-line comments in JavaScript?", options: ["//", "!--", "#", "/* */"], correctAnswer: 0 },
  { id: 20, topic: "JavaScript", difficulty: "easy",   question: "How do you declare a variable in JavaScript?", options: ["var myVar;", "variable myVar;", "v myVar;", "myVar = var;"], correctAnswer: 0 },
  { id: 21, topic: "JavaScript", difficulty: "easy",   question: "Which method writes to the browser console?", options: ["console.log()", "log.console()", "print()", "console.write()"], correctAnswer: 0 },
  { id: 22, topic: "JavaScript", difficulty: "easy",   question: "Which operator assigns a value to a variable?", options: ["-", "*", "=", "+"], correctAnswer: 2 },
  // JavaScript — Medium
  { id: 23, topic: "JavaScript", difficulty: "medium", question: "How do you call a function named 'myFunction'?", options: ["call myFunction()", "myFunction()", "call function myFunction()", "Call.myFunction()"], correctAnswer: 1 },
  { id: 24, topic: "JavaScript", difficulty: "medium", question: "Which method removes the last element of an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: 0 },
  { id: 25, topic: "JavaScript", difficulty: "medium", question: "What does the '===' operator check for?", options: ["Equality with type coercion", "Strict equality", "Type only", "Object comparison"], correctAnswer: 1 },
  { id: 26, topic: "JavaScript", difficulty: "medium", question: "How do you write an array in JavaScript?", options: ["[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)", "array(1, 2, 3)"], correctAnswer: 0 },
  { id: 27, topic: "JavaScript", difficulty: "medium", question: "Which method adds a new element to the END of an array?", options: ["push()", "add()", "insert()", "append()"], correctAnswer: 0 },
  // JavaScript — Hard
  { id: 34, topic: "JavaScript", difficulty: "hard",   question: "What does 'typeof null' return in JavaScript?", options: ["'object'", "'null'", "'undefined'", "'boolean'"], correctAnswer: 0 },
  { id: 35, topic: "JavaScript", difficulty: "hard",   question: "Which keyword declares a block-scoped variable that cannot be reassigned?", options: ["const", "let", "var", "static"], correctAnswer: 0 },
  { id: 36, topic: "JavaScript", difficulty: "hard",   question: "What is the output of: console.log(0.1 + 0.2 === 0.3)?", options: ["false", "true", "undefined", "NaN"], correctAnswer: 0 },
];

const TOPICS = ["HTML", "CSS", "JavaScript"];
const DIFFICULTIES = ["easy", "medium", "hard"];
