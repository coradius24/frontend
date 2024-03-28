import { WHITELISTED_MAIL_DOMAINS } from "@/constants";
import { toast } from "react-hot-toast";

/**
 * Show a toast message using react-hot-toast.
 *
 * @param {string} message - The message to display in the toast.
 * @param {string} [type='success'] - The type of toast ('success' or 'error').
 */
export const showToast = (message, type = "success", _options = {}) => {
  const options = {
    duration: 3000,
    position: "center-top",
    style: {
      marginTop: "65px",
    },
    ..._options,
  };

  if (type === "success") {
    return toast.success(message, options);
  } else if (type === "error") {
    return toast.error(message, options);
  }
};

export const checkEmptyValue = (data) => {
  for (const key in data) {
    if (data.hasOwnProperty(key) && !data[key]) {
      return { message: `${formatUnderscoreString(key)} can't be empty!`, key };
    }
  }
  return false;
};

export const emailValidation = (email, skipWhitelistCheck = false) => {
  const [_, emailDomain] = email?.trim()?.split("@");
  if (!skipWhitelistCheck) {
    if (!WHITELISTED_MAIL_DOMAINS.includes("@" + emailDomain)) {
      return false;
    }
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return emailRegex.test(email);
};

export const phoneNumberValidation = (number) => {
  const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
  return regex.test(number);
};

export const formatUnderscoreString = (inputString) => {
  // Convert camelCase to words with spaces
  inputString = inputString.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Split by underscores or spaces and capitalize each word
  return inputString
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formateDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

/**
 * Format a duration in seconds into the "HH:mm:ss" format.
 *
 * @param {number} seconds - The duration in seconds.
 * @returns {string} The formatted duration in "HH:mm:ss" format.
 */
function formatSingleDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Format a duration or an array of durations into the "HH:mm:ss" format.
 * If an array is provided, the durations will be summed.
 *
 * @param {number | number[]} duration - The duration(s) in seconds.
 * @returns {string} The formatted duration in "HH:mm:ss" format.
 */
export function formatDuration(duration) {
  if (Array.isArray(duration)) {
    const totalSeconds = duration.reduce(
      (acc, seconds) => acc + seconds.durationInSecond,
      0
    );
    return formatSingleDuration(totalSeconds);
  } else {
    return formatSingleDuration(duration);
  }
}

export function checkLang(text) {
  const englishRange = /[a-zA-Z]/;
  if (englishRange.test(text)) {
    return "eng";
  }
  return "bn";
}

export function getQueryString(params) {
  const queryString = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");

  return queryString;
}

/**
 * Convert total minutes to hours, minutes, and seconds format (HH:MM:SS).
 * @param {number} minutes - The total number of minutes.
 * @returns {string} The formatted time in "HH:MM:SS" format.
 * @throws {Error} If the input is not a valid number.
 */

export const minutesToHours = (minutes) => {
  if (isNaN(minutes)) {
    return `0:00:0`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const seconds = Math.floor((minutes % 1) * 60);

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(remainingMinutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Format the number to include commas and decimal points based on the value.
 * @param {number} number - The number to be formatted.
 * @returns {string} The formatted number with commas and decimal points.
 * @throws {Error} If the input is not a valid number.
 */
export const formatNumber = (number) => {
  if (isNaN(number)) {
    return "0.0";
  }

  if (number >= 1000) {
    return number.toLocaleString();
  } else {
    return Number(number).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};

/**
 * Calculate the percentage discount based on the original price and the discounted price.
 * @param {number} price - The original price.
 * @param {number} discountedPrice - The discounted price.
 * @returns {number} The percentage discount.
 */
export const gateDiscountPercentage = (price, discountedPrice) => {
  if (isNaN(price) || isNaN(discountedPrice)) {
    throw new Error("Invalid input. Please provide valid numbers.");
  }

  const discount = price - discountedPrice;
  const discountPercentage = (discount / price) * 100;
  return discountPercentage;
};

export const formatBlogDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

export const dateWithTime = (inputDate) => {
  const date = new Date(inputDate);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const checkExpireDate = (expiry) => {
  const expiryDate = new Date(expiry);
  const currentDate = new Date();
  return expiryDate < currentDate;
};
const documentWhiteListWords = [
  "republic",
  "bangladesh",
  "date of",
  "birth",
  "government",
  "গণপ্রজাতন্ত্রী",
  "বাংলাদেশ",
  "জন্ম",
  "মুত্যু",
  "নিবন্ধকের",
  "কার্যালয়",
  "নিবন্ধন",
  "নিবন্ধনের তারিখ",
  "জন্ম তারিখ",
  "পিতার নাম",
  "মাতার নাম",
  "জন্ম সনদ",
  "bangladeshi",
];
export const checkDocumentValidity = (text) => {
  text = text?.toLowerCase() || "";
  if (
    documentWhiteListWords.some((whiteListedWord) =>
      text.includes(whiteListedWord)
    )
  ) {
    return true;
  }

  return false;
};

export const formatDateInBengali = (dateString) => {
  const date = new Date(dateString);

  const day = date.toLocaleString("en", { day: "numeric" });
  const month = new Intl.DateTimeFormat("bn", { month: "long" }).format(date);
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);

  return `${day} ${month}, ${year}`;
};

export const updateSectionWithWatchHistory = (
  sections,
  watchHistory,
  previousLesson = null
) => {
  sections.forEach((section) => {
    section.lessons.forEach((lesson) => {
      lesson.isLink = false;
    });
  });

  if (watchHistory.length === 0 && previousLesson) {
    return {
      isValid: false,
      updatedData: sections,
    };
  }

  if (watchHistory.length > 0) {
    const watchHistoryLookup = watchHistory.reduce((lookup, item) => {
      const key = `${item.sectionId}-${item.lessonId}`;
      lookup[key] = true;
      return lookup;
    }, {});

    if (previousLesson) {
      const previousLessonKey = `${previousLesson.sectionId}-${previousLesson.id}`;
      const isValidLesson = !!watchHistoryLookup[previousLessonKey];
      if (!isValidLesson) {
        return {
          isValid: false,
          updatedData: sections,
        };
      }
    }
    sections.forEach((section) => {
      section.lessons.forEach((lesson) => {
        const key = `${section.id}-${lesson.id}`;
        lesson.isLink = !!watchHistoryLookup[key];
      });
    });
  } else {
    if (sections.length > 0 && sections[0].lessons.length > 0) {
      sections[0].lessons[0].isLink = true;
    }
  }

  return {
    isValid: true,
    updatedData: sections,
  };
};
