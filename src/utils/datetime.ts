import { i18n } from "@/language/index";
const { t } = i18n.global;

export function getWeekNo(): string {
  const dayOfWeek = new Date().getDay();
  const dayNames = [
    t("footer.weeks.Sunday"),
    t("footer.weeks.Monday"),
    t("footer.weeks.Tuesday"),
    t("footer.weeks.Wednesday"),
    t("footer.weeks.Thursday"),
    t("footer.weeks.Friday"),
    t("footer.weeks.Saturday"),
  ];
  return dayNames[dayOfWeek];
}

//  返回中文年月日
export function getDateMessage(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}年${month}月${day}日`;
}

// 返回英文年月日
export function getEnglishDate(): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
