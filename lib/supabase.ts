// إعدادات الاتصال بقاعدة بيانات Supabase
// هذه القيم عامة وآمنة للنشر في الواجهة — الحماية عبر Row Level Security:
// المفتاح العام يسمح فقط بإضافة النتائج، ولا يسمح بقراءتها.

export const SUPABASE_URL = "https://gkmdkelbgajgunwbnxgc.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_Q-VLPu97_dDgdyJLSr9dlw_dgvrHvX0";
export const ADMIN_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/admin-submissions`;
