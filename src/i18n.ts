import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      language: { english: 'English', persian: 'فارسی', switch: 'Language' },
      navigation: {
        main: 'Main navigation', dashboard: 'Dashboard', myWorkouts: 'My Workouts',
        discoverCoaches: 'Discover Coaches', myProfile: 'My Profile', overview: 'Overview',
        exerciseLibrary: 'Exercise Library', workoutBuilder: 'Workout Builder',
        findCoach: 'Find a Coach'
      },
      workspace: {
        admin: 'Admin workspace', coach: 'Coach workspace', athlete: 'Athlete workspace',
        member: 'Member workspace', title: 'Workspace', administrator: 'Administrator account',
        coachAccount: 'Coach account', athleteAccount: 'Athlete account', account: 'Vigo account',
        memberName: 'Vigo member', memberRole: 'Member', signOut: 'Sign out',
        backToOverview: 'Back to overview'
      },
      common: {
        loading: 'Loading...', search: 'Search', previous: 'Previous', next: 'Next',
        tryAgain: 'Try again', about: 'About', experience: 'Experience',
        years: 'years', activeAthletes: 'Active athletes', startingFrom: 'Starting from',
        notListed: 'Not listed', viewProfile: 'View profile', browseCoaches: 'Browse coaches',
        noResults: 'No results found', cancel: 'Cancel', save: 'Save', edit: 'Edit',
        delete: 'Delete', close: 'Close', submit: 'Submit', back: 'Back'
      },
      coachDirectory: {
        title: 'Discover coaches', nameOrKeyword: 'Name or keyword',
        searchPlaceholder: 'Search coaches', specialty: 'Specialty',
        minPrice: 'Min. price (Toman)', maxPrice: 'Max. price (Toman)',
        sortBy: 'Sort by', newest: 'Newest', priceLowHigh: 'Price: low to high',
        priceHighLow: 'Price: high to low', couldNotLoad: 'Could not load coaches',
        loading: 'Loading coaches...', noneFound: 'No coaches found',
        changeFilters: 'Try changing your search terms or filters.',
        coachesFound: 'coaches found', approvedOnly: 'Only approved and active coaches are listed.',
        page: 'Page', of: 'of'
      },
      coachProfile: {
        title: 'Coach profile', back: 'Back to coaches', loading: 'Loading coach profile...',
        unavailable: 'Coach profile unavailable', notFound: 'This coach profile could not be found.',
        activeAthletes: 'Active athletes', startingPlanPrice: 'Starting plan price',
        notAvailable: 'Not available yet', certifications: 'Certifications',
        plansUnavailable: 'Coaching plans are not available yet',
        plansExplanation: 'The current User service does not expose plan endpoints. This profile uses only the public coach profile API and does not request placeholder plan data.',
        years: 'years'
      },
      landing: {
        product: 'Product', athletes: 'For athletes', coaches: 'For coaches',
        howItWorks: 'How it works', findCoach: 'Find a coach',
        buildWorkouts: 'Build structured workouts', connected: 'Keep training connected',
        feedback: 'Review and give feedback', discover: 'Discover', plan: 'Plan',
        train: 'Train', progress: 'Progress'
      },
      auth: {
        sharedSpace: 'A shared space for athletes and coaches.',
        trainClearly: 'TRAIN WITH CLARITY', move: 'Move with',
        purpose: 'purpose.', clearPlans: 'Clear plans. Stronger connections.',
        onePlace: 'One place to bring your training together.',
        nextStep: 'Built for your next step.'
      },
      errors: {
        suspended: 'Account suspended',
        suspendedDescription: 'Your account is currently suspended. Please contact support for assistance.'
      }
    }
  },
  fa: {
    translation: {
      language: { english: 'English', persian: 'فارسی', switch: 'زبان' },
      navigation: {
        main: 'ناوبری اصلی', dashboard: 'داشبورد', myWorkouts: 'تمرین‌های من',
        discoverCoaches: 'جستجوی مربی', myProfile: 'پروفایل من', overview: 'نمای کلی',
        exerciseLibrary: 'کتابخانه حرکات', workoutBuilder: 'برنامه‌ساز تمرین',
        findCoach: 'پیدا کردن مربی'
      },
      workspace: {
        admin: 'فضای مدیریت', coach: 'فضای مربی', athlete: 'فضای ورزشکار',
        member: 'فضای کاربری', title: 'فضای کاربری', administrator: 'حساب مدیر',
        coachAccount: 'حساب مربی', athleteAccount: 'حساب ورزشکار', account: 'حساب ویگو',
        memberName: 'عضو ویگو', memberRole: 'عضو', signOut: 'خروج از حساب',
        backToOverview: 'بازگشت به نمای کلی'
      },
      common: {
        loading: 'در حال بارگذاری...', search: 'جستجو', previous: 'قبلی', next: 'بعدی',
        tryAgain: 'تلاش دوباره', about: 'درباره', experience: 'سابقه فعالیت',
        years: 'سال', activeAthletes: 'ورزشکاران فعال', startingFrom: 'شروع قیمت از',
        notListed: 'ثبت نشده', viewProfile: 'مشاهده پروفایل', browseCoaches: 'مشاهده مربیان',
        noResults: 'نتیجه‌ای پیدا نشد', cancel: 'لغو', save: 'ذخیره', edit: 'ویرایش',
        delete: 'حذف', close: 'بستن', submit: 'ثبت', back: 'بازگشت'
      },
      coachDirectory: {
        title: 'جستجوی مربی', nameOrKeyword: 'نام یا کلمه کلیدی',
        searchPlaceholder: 'جستجوی مربی', specialty: 'تخصص',
        minPrice: 'حداقل قیمت (تومان)', maxPrice: 'حداکثر قیمت (تومان)',
        sortBy: 'مرتب‌سازی بر اساس', newest: 'جدیدترین', priceLowHigh: 'قیمت: از کم به زیاد',
        priceHighLow: 'قیمت: از زیاد به کم', couldNotLoad: 'بارگذاری مربیان ممکن نشد',
        loading: 'در حال بارگذاری مربیان...', noneFound: 'مربی‌ای پیدا نشد',
        changeFilters: 'عبارت جستجو یا فیلترها را تغییر دهید.',
        coachesFound: 'مربی پیدا شد', approvedOnly: 'فقط مربیان تاییدشده و فعال نمایش داده می‌شوند.',
        page: 'صفحه', of: 'از'
      },
      coachProfile: {
        title: 'پروفایل مربی', back: 'بازگشت به مربیان', loading: 'در حال بارگذاری پروفایل مربی...',
        unavailable: 'پروفایل مربی در دسترس نیست', notFound: 'پروفایل این مربی پیدا نشد.',
        activeAthletes: 'ورزشکاران فعال', startingPlanPrice: 'قیمت شروع برنامه',
        notAvailable: 'هنوز در دسترس نیست', certifications: 'گواهینامه‌ها',
        plansUnavailable: 'برنامه‌های مربی‌گری هنوز در دسترس نیستند',
        plansExplanation: 'سرویس فعلی کاربر، مسیرهای دریافت برنامه را ارائه نمی‌کند. این پروفایل فقط از API عمومی مربی استفاده می‌کند و داده ساختگی برای برنامه‌ها درخواست نمی‌کند.',
        years: 'سال'
      },
      landing: {
        product: 'محصول', athletes: 'برای ورزشکاران', coaches: 'برای مربیان',
        howItWorks: 'نحوه کار', findCoach: 'پیدا کردن مربی',
        buildWorkouts: 'ساخت تمرین‌های ساختاریافته', connected: 'تمرین‌ها را یکپارچه دنبال کنید',
        feedback: 'بررسی و ثبت بازخورد', discover: 'کشف', plan: 'برنامه‌ریزی',
        train: 'تمرین', progress: 'پیشرفت'
      },
      auth: {
        sharedSpace: 'فضایی مشترک برای ورزشکاران و مربیان.',
        trainClearly: 'شفاف و هدفمند تمرین کنید', move: 'با هدف',
        purpose: 'حرکت کنید.', clearPlans: 'برنامه‌های روشن. ارتباط‌های قوی‌تر.',
        onePlace: 'تمام فرایند تمرین شما، در یک مکان.',
        nextStep: 'برای قدم بعدی شما ساخته شده است.'
      },
      errors: {
        suspended: 'حساب کاربری تعلیق شده است',
        suspendedDescription: 'حساب کاربری شما در حال حاضر تعلیق شده است. برای دریافت راهنمایی با پشتیبانی تماس بگیرید.'
      }
    }
  }
} as const

const syncDocumentLanguage = (language: string) => {
  const locale = language === 'fa' ? 'fa' : 'en'
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr'
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fa'],
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'vigo-language',
      caches: ['localStorage']
    },
    interpolation: { escapeValue: false },
    returnNull: false
  })

syncDocumentLanguage(i18n.resolvedLanguage || i18n.language || 'en')
i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
