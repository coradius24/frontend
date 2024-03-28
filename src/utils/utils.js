import { WHITELISTED_MAIL_DOMAINS } from "@/constants";

export function formatMyFeatures(_data = []) {
  if(!Array.isArray(_data)) {
    return []
  }
  const data = _data.sort((a, b) => {
    if (a.parent !== null && b.parent === null) {
      return 1; // 'a' comes before 'b'
    } else if (a.parent === null && b.parent !== null) {
      return -1; // 'b' comes before 'a'
    }

    return 0; // Maintain the current order when both have 'parent' as null or non-null
  });


  const map = {};
  data.forEach((feature) => {
    const { frontendSectionGroup, name, id, frontendUrl, parent } = feature;

    if (!map[frontendSectionGroup]) {
      map[frontendSectionGroup] = [];
    }

    const parentFeature = map?.[frontendSectionGroup]?.find(
      (feature) => feature.id == parent
    );

    if (parentFeature) {
      parentFeature.children.push({ title: name, id, href: frontendUrl });
    } else {
      if (!parent) {
        map[frontendSectionGroup].push({
          title: name,
          href: frontendUrl,
          id,
          children: [],
        });
      }
    }
  });

  return map;
}

export function sanitizeAndTruncateString(str, maxLength) {
  if (str) {
    // Remove HTML tags and then truncate the text
    return str.replace(/&nbsp;/g, '').replace(/<[^>]+>/g, "").slice(0, maxLength) + "...";
  }
  return null;
}

export const MONTH_DICT = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

export function isValidDate(dateString) {
  const dateObj = new Date(dateString);
  return !isNaN(dateObj.getTime());
}

export const downloadFile = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType });
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

export const parseCSV = (data) => {
  const csvData = [];

  const lines = data.split("\n");

  for (let i = 0; i < lines.length; i++) {
    // Use a regular expression to handle fields enclosed in double quotes
    const fields = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

    // Remove double quotes from fields (if present)
    const sanitizedFields = fields.map((field) =>
      field.replace(/^"(.*)"$/, "$1")
    );

    csvData[i] = sanitizedFields;
  }

  return csvData;
};

export const mailSuggest = (email = "") => {
  const [mailIdentifier, _domainPart] = email
    ?.toLocaleLowerCase()
    ?.trim()
    ?.split("@");
  const domainPart = "@" + _domainPart;
  // cases for gmail
  if (
    domainPart?.startsWith("gm") &&
    !WHITELISTED_MAIL_DOMAINS?.includes(domainPart)
  ) {
    console.log(
      "In this ",
      domainPart,
      WHITELISTED_MAIL_DOMAINS,
      WHITELISTED_MAIL_DOMAINS?.includes(domainPart),
      domainPart === "@gmail.com",
      domainPart,
      "@gmail.com",
      domainPart?.length,
      "@gmail.com"?.length
    );
    return [mailIdentifier + "@gmail.com"];
  }
  if (
    domainPart?.includes("gamil") &&
    !WHITELISTED_MAIL_DOMAINS?.includes(domainPart)
  ) {
    return [mailIdentifier + "@gmail.com"];
  }
  if (
    domainPart?.includes("il") &&
    domainPart?.includes("g") &&
    !WHITELISTED_MAIL_DOMAINS?.includes(domainPart)
  ) {
    return [mailIdentifier + "@gmail.com"];
  }

  if (
    domainPart?.includes("ail") &&
    !WHITELISTED_MAIL_DOMAINS?.includes(domainPart)
  ) {
    return [mailIdentifier + "@gmail.com", mailIdentifier + "@hotmail.com"];
  }

  // yahoo
  if (
    domainPart?.includes("oo") &&
    !WHITELISTED_MAIL_DOMAINS?.includes(domainPart)
  ) {
    return [mailIdentifier + "@yahoo.com"];
  }

  if (
    domainPart?.includes("clou") &&
    !WHITELISTED_MAIL_DOMAINS?.includes(domainPart)
  ) {
    return ["@icloud.com"];
  }

  if (
    domainPart?.includes("hot") &&
    !WHITELISTED_MAIL_DOMAINS?.includes(domainPart)
  ) {
    return [mailIdentifier + "@hotmail.com"];
  }

  return [];
};


export const capitalize = (str) => {
  return (str[0] ? str[0].toUpperCase() : "") + str.slice(1)
}



export function getDeviceName() {
  // Check if the navigator.userAgent property is available
  if (navigator.userAgent) {
    const userAgent = navigator.userAgent;

    // Detect common device names based on user agent string
    if (userAgent.match(/Android/i)) {
      return 'Android Device';
    } else if (userAgent.match(/iPhone/i) || userAgent.match(/iPad/i) || userAgent.match(/iPod/i)) {
      return 'iOS Device';
    } else if (userAgent.match(/Windows Phone/i) || userAgent.match(/IEMobile/i)) {
      return 'Windows Phone';
    } else if (userAgent.match(/Windows/i)) {
      return 'Windows PC';
    } else if (userAgent.match(/Macintosh/i) || userAgent.match(/Mac OS/i)) {
      return 'Mac';
    } else if (userAgent.match(/Linux/i) || userAgent.match(/Ubuntu/i) || userAgent.match(/Fedora/i)) {
      return 'Linux Device';
    } else {
      return 'Unknown Device';
    }
  } else {
    return 'Unknown Device';
  }
}


