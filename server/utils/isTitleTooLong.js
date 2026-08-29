export function isTitleTooLong(title, maxLength = 40) {
  return title.length > maxLength;
}

// console.log(isTitleTooLong('This is a very long link title...', 40));
