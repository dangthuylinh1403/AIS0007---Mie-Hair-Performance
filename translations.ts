import { Translation } from "./types";

const en: Translation = {
  // Header
  facebookAria: "Facebook Profile",
  phoneAria: "Telephone/Zalo",
  telegramAria: "Telegram Profile",
  backToTopAria: "Back to top",
  scrollToTopAria: "Scroll to top",
  settingsAria: "Open settings",
  openUserGuideAria: "Open User Guide",
  howToUseThisApp: "How to Use This App",
  adminDashboard: "Manager Dashboard",
  employeeDashboard: "My Performance",

  // ThemeToggle & Controller
  toggleThemeAria: "Toggle theme",
  appearanceSettingsAria: "Appearance",
  themeLabel: "Theme",
  lightTheme: "Light",
  darkTheme: "Dark",
  accentColorLabel: "Accent Color",

  // LanguageSwitcher
  language: "Language",

  // Footer
  copyright: (year) => `© ${year} Mie Hair. All rights reserved.`,
  contactUs: "Contact Us",

  // TopBar
  yourSession: "Your Session",
  ipAddress: "IP",
  sessionTime: "Time",
  liveActivity: "Live Activity",
  activeSubs: "Active Users",
  totalHoursTicker: "Total Hours Tracked",

  // Auth
  authHeader: "Welcome to Mie Hair",
  authPrompt: "Sign in to your account to continue.",
  authPromptLogin: "Don't have an account?",
  emailLabel: "Email address",
  passwordLabel: "Password",
  signIn: "Sign In",
  signUp: "Sign Up",
  signOut: "Sign Out",
  signingIn: "Signing In...",
  signingUp: "Signing Up...",
  magicLinkSent: "Check your email for the login link!",
  signInToContinue: "Sign in to continue",
  cancel: "Cancel",

  // Account Modal
  accountSettings: "Account Settings",
  profile: "Profile",
  password: "Password",
  updateProfile: "Update Profile",
  fullName: "Full Name",
  avatar: "Avatar",
  uploading: "Uploading...",
  uploadAvatar: "Upload Avatar",
  update: "Update",
  updating: "Updating...",
  profileUpdated: "Profile updated successfully!",
  changePassword: "Change Password",
  newPassword: "New Password",
  confirmNewPassword: "Confirm New Password",
  passwordUpdated: "Password updated successfully!",
  passwordsDoNotMatch: "Passwords do not match.",

  // Calendar Timesheet
  dashboardTitle: "Performance Calendar",
  startShift: "Start Shift",
  endShift: "End Shift",
  shiftInProgress: "Shift in Progress",
  shiftStartedAt: (time) => `Started at ${time}`,
  currentDuration: "Duration",
  totalHours: "hrs",
  signInToTrackTime: "Please sign in to track your time.",

  // Calendar
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today",

  // Date Range Selector
  dateRange: "Date Range",
  thisWeek: "This Week",
  lastWeek: "Last Week",
  thisMonth: "This Month",
  lastMonth: "Last Month",
  year: "Year",
  month: "Month",

  // Monthly Summary
  monthlySummary: "Performance Summary",
  totalHoursWorked: "Total Hours Worked",
  totalWorkDays: "Total Work Days",
  totalShifts: "Total Shifts",
  averageHoursPerDay: "Average Hours/Day",
  dailyHoursOverview: "Daily Hours Overview",

  // Admin Dashboard
  allEmployees: "All Stylists",
  selectEmployeePrompt: "Select a stylist to view their performance.",
  timeEntriesFor: (name: string) => `Performance for ${name}`,
  noEntriesFound: "No entries found for this period.",
  addEntry: "Add Entry",
  editEntry: "Edit Entry",
  deleteEntry: "Delete Entry",
  confirmDelete: "Confirm Delete",
  deleteConfirmationMessage: (entryInfo: string) => `Are you sure you want to delete this time entry? ${entryInfo}`,
  date: "Date",
  startTime: "Start Time",
  endTime: "End Time",
  actions: "Actions",
  workDays: "Work Days",
  avgHours: "Avg Hours/Day",
  overallSummary: "Overall Summary",
  employeeLeaderboard: "Employee Leaderboard",

  // Generic Actions
  close: "Close",
  save: "Save",
  
  // Add/Edit Time Entry Modal
  addNewTimeEntry: "Add New Time Entry",
  
  // Performance Review Modal
  editPerformanceReview: "Edit Performance Review",
  score: "Score",
  comments: "Comments",

  // FIX: Add missing translations
  // Cart & Checkout
  yourCart: "Your Cart",
  remove: "Remove",
  emptyCart: "Your cart is empty",
  emptyCartPrompt: "Looks like you haven't added anything yet.",
  subtotal: "Subtotal",
  checkout: "Proceed to Checkout",
  addToCart: "Add to Cart",
  addedToCart: "Added!",
  purchaseSuccessful: "Purchase Successful!",
  purchaseSuccessfulMessage: "Thank you for your order. A confirmation has been sent to your email.",
  checkoutTitle: "Confirm Your Order",
  quantity: "Quantity",
  total: "Total",
  confirmPurchase: "Confirm Purchase",

  // Admin Modals
  employee: "Stylist",
  selectEmployee: "Select a Stylist",
  editEmployeeProfile: "Edit Stylist Profile",
  role: "Position",
  admin: "Manager",
};

const vi: Translation = {
  // Header
  facebookAria: "Hồ sơ Facebook",
  phoneAria: "Điện thoại/Zalo",
  telegramAria: "Hồ sơ Telegram",
  backToTopAria: "Quay về đầu trang",
  scrollToTopAria: "Cuộn lên đầu trang",
  settingsAria: "Mở cài đặt",
  openUserGuideAria: "Mở Hướng dẫn sử dụng",
  howToUseThisApp: "Hướng dẫn sử dụng ứng dụng",
  adminDashboard: "Trang Quản lý",
  employeeDashboard: "Hiệu suất của tôi",

  // ThemeToggle & Controller
  toggleThemeAria: "Chuyển đổi giao diện",
  appearanceSettingsAria: "Giao diện",
  themeLabel: "Giao diện",
  lightTheme: "Sáng",
  darkTheme: "Tối",
  accentColorLabel: "Màu nhấn",

  // LanguageSwitcher
  language: "Ngôn ngữ",

  // Footer
  copyright: (year) => `© ${year} Mie Hair. Đã đăng ký bản quyền.`,
  contactUs: "Liên hệ",

  // TopBar
  yourSession: "Phiên của bạn",
  ipAddress: "IP",
  sessionTime: "Thời gian",
  liveActivity: "Hoạt động",
  activeSubs: "Người dùng",
  totalHoursTicker: "Tổng Giờ Đã Ghi Nhận",
  
  // Auth
  authHeader: "Chào mừng đến với Mie Hair",
  authPrompt: "Đăng nhập để tiếp tục.",
  authPromptLogin: "Chưa có tài khoản?",
  emailLabel: "Địa chỉ email",
  passwordLabel: "Mật khẩu",
  signIn: "Đăng nhập",
  signUp: "Đăng ký",
  signOut: "Đăng xuất",
  signingIn: "Đang đăng nhập...",
  signingUp: "Đang đăng ký...",
  magicLinkSent: "Kiểm tra email của bạn để lấy liên kết đăng nhập!",
  signInToContinue: "Đăng nhập để tiếp tục",
  cancel: "Hủy",

  // Account Modal
  accountSettings: "Cài đặt tài khoản",
  profile: "Hồ sơ",
  password: "Mật khẩu",
  updateProfile: "Cập nhật hồ sơ",
  fullName: "Họ và tên",
  avatar: "Ảnh đại diện",
  uploading: "Đang tải lên...",
  uploadAvatar: "Tải ảnh đại diện",
  update: "Cập nhật",
  updating: "Đang cập nhật...",
  profileUpdated: "Hồ sơ đã được cập nhật thành công!",
  changePassword: "Đổi mật khẩu",
  newPassword: "Mật khẩu mới",
  confirmNewPassword: "Xác nhận mật khẩu mới",
  passwordUpdated: "Mật khẩu đã được cập nhật thành công!",
  passwordsDoNotMatch: "Mật khẩu không khớp.",
  
  // Calendar Timesheet
  dashboardTitle: "Lịch Hiệu Suất",
  startShift: "Bắt đầu Ca",
  endShift: "Kết thúc Ca",
  shiftInProgress: "Đang trong Ca làm việc",
  shiftStartedAt: (time) => `Bắt đầu lúc ${time}`,
  currentDuration: "Thời gian",
  totalHours: "giờ",
  signInToTrackTime: "Vui lòng đăng nhập để chấm công.",

  // Calendar
  monthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
  dayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay",

  // Date Range Selector
  dateRange: "Phạm vi ngày",
  thisWeek: "Tuần này",
  lastWeek: "Tuần trước",
  thisMonth: "Tháng này",
  lastMonth: "Tháng trước",
  year: "Năm",
  month: "Tháng",

  // Monthly Summary
  monthlySummary: "Thống Kê Hiệu Suất",
  totalHoursWorked: "Tổng Giờ Làm Việc",
  totalWorkDays: "Tổng Số Ngày Làm",
  totalShifts: "Tổng Số Ca",
  averageHoursPerDay: "Giờ Trung Bình/Ngày",
  dailyHoursOverview: "Tổng Quan Giờ Hàng Ngày",
  
  // Admin Dashboard
  allEmployees: "Tất cả Stylist",
  selectEmployeePrompt: "Chọn một stylist để xem hiệu suất.",
  timeEntriesFor: (name: string) => `Hiệu suất của ${name}`,
  noEntriesFound: "Không tìm thấy dữ liệu cho khoảng thời gian này.",
  addEntry: "Thêm ca",
  editEntry: "Sửa ca",
  deleteEntry: "Xóa ca",
  confirmDelete: "Xác nhận xóa",
  deleteConfirmationMessage: (entryInfo: string) => `Bạn có chắc muốn xóa ca làm việc này không? ${entryInfo}`,
  date: "Ngày",
  startTime: "Giờ bắt đầu",
  endTime: "Giờ kết thúc",
  actions: "Hành động",
  workDays: "Ngày làm việc",
  avgHours: "Giờ TB/Ngày",
  overallSummary: "Tổng quan chung",
  employeeLeaderboard: "Bảng xếp hạng nhân viên",

  // Generic Actions
  close: "Đóng",
  save: "Lưu",

  // Add/Edit Time Entry Modal
  addNewTimeEntry: "Thêm Ca làm việc mới",

  // Performance Review Modal
  editPerformanceReview: "Chỉnh sửa Đánh giá Hiệu suất",
  score: "Điểm",
  comments: "Bình luận",

  // FIX: Add missing translations
  // Cart & Checkout
  yourCart: "Giỏ hàng của bạn",
  remove: "Xóa",
  emptyCart: "Giỏ hàng của bạn đang trống",
  emptyCartPrompt: "Có vẻ như bạn chưa thêm gì vào giỏ hàng.",
  subtotal: "Tạm tính",
  checkout: "Tiến hành thanh toán",
  addToCart: "Thêm vào giỏ",
  addedToCart: "Đã thêm!",
  purchaseSuccessful: "Mua hàng thành công!",
  purchaseSuccessfulMessage: "Cảm ơn bạn đã đặt hàng. Một email xác nhận đã được gửi đến bạn.",
  checkoutTitle: "Xác nhận Đơn hàng",
  quantity: "Số lượng",
  total: "Tổng cộng",
  confirmPurchase: "Xác nhận Mua hàng",

  // Admin Modals
  employee: "Stylist",
  selectEmployee: "Chọn một Stylist",
  editEmployeeProfile: "Chỉnh sửa Hồ sơ Stylist",
  role: "Chức vụ",
  admin: "Quản lý",
};

const th: Translation = {
  // Header
  facebookAria: "โปรไฟล์ Facebook",
  phoneAria: "โทรศัพท์/Zalo",
  telegramAria: "โปรไฟล์ Telegram",
  backToTopAria: "กลับไปด้านบน",
  scrollToTopAria: "เลื่อนไปด้านบนสุด",
  settingsAria: "เปิดการตั้งค่า",
  openUserGuideAria: "เปิดคู่มือการใช้งาน",
  howToUseThisApp: "วิธีใช้แอพนี้",
  adminDashboard: "แดชบอร์ดผู้จัดการ",
  employeeDashboard: "ผลงานของฉัน",

  // ThemeToggle & Controller
  toggleThemeAria: "สลับธีม",
  appearanceSettingsAria: "ลักษณะ",
  themeLabel: "ธีม",
  lightTheme: "สว่าง",
  darkTheme: "มืด",
  accentColorLabel: "สีเน้น",

  // LanguageSwitcher
  language: "ภาษา",

  // Footer
  copyright: (year) => `© ${year} Mie Hair. สงวนลิขสิทธิ์`,
  contactUs: "ติดต่อเรา",

  // TopBar
  yourSession: "เซสชันของคุณ",
  ipAddress: "IP",
  sessionTime: "เวลา",
  liveActivity: "กิจกรรมสด",
  activeSubs: "ผู้ใช้งาน",
  totalHoursTicker: "ชั่วโมงทั้งหมดที่บันทึก",

  // Auth
  authHeader: "ยินดีต้อนรับสู่ Mie Hair",
  authPrompt: "ลงชื่อเข้าใช้บัญชีของคุณเพื่อดำเนินการต่อ",
  authPromptLogin: "ไม่มีบัญชี?",
  emailLabel: "ที่อยู่อีเมล",
  passwordLabel: "รหัสผ่าน",
  signIn: "ลงชื่อเข้าใช้",
  signUp: "ลงทะเบียน",
  signOut: "ออกจากระบบ",
  signingIn: "กำลังลงชื่อเข้าใช้...",
  signingUp: "กำลังลงทะเบียน...",
  magicLinkSent: "ตรวจสอบอีเมลของคุณสำหรับลิงค์เข้าสู่ระบบ!",
  signInToContinue: "ลงชื่อเข้าใช้เพื่อดำเนินการต่อ",
  cancel: "ยกเลิก",

  // Account Modal
  accountSettings: "ตั้งค่าบัญชี",
  profile: "โปรไฟล์",
  password: "รหัสผ่าน",
  updateProfile: "อัปเดตโปรไฟล์",
  fullName: "ชื่อเต็ม",
  avatar: "อวตาร",
  uploading: "กำลังอัปโหลด...",
  uploadAvatar: "อัปโหลดอวตาร",
  update: "อัปเดต",
  updating: "กำลังอัปเดต...",
  profileUpdated: "อัปเดตโปรไฟล์สำเร็จแล้ว!",
  changePassword: "เปลี่ยนรหัสผ่าน",
  newPassword: "รหัสผ่านใหม่",
  confirmNewPassword: "ยืนยันรหัสผ่านใหม่",
  passwordUpdated: "อัปเดตรหัสผ่านสำเร็จแล้ว!",
  passwordsDoNotMatch: "รหัสผ่านไม่ตรงกัน",
  
  // Calendar Timesheet
  dashboardTitle: "ปฏิทินผลการปฏิบัติงาน",
  startShift: "เริ่มกะ",
  endShift: "สิ้นสุดกะ",
  shiftInProgress: "อยู่ในกะ",
  shiftStartedAt: (time) => `เริ่มเมื่อ ${time}`,
  currentDuration: "ระยะเวลา",
  totalHours: "ชม.",
  signInToTrackTime: "กรุณาลงชื่อเข้าใช้เพื่อบันทึกเวลา",

  // Calendar
  monthNames: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
  dayNames: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
  today: "วันนี้",

  // Date Range Selector
  dateRange: "ช่วงวันที่",
  thisWeek: "สัปดาห์นี้",
  lastWeek: "สัปดาห์ที่แล้ว",
  thisMonth: "เดือนนี้",
  lastMonth: "เดือนที่แล้ว",
  year: "ปี",
  month: "เดือน",

  // Monthly Summary
  monthlySummary: "สรุปผลการปฏิบัติงาน",
  totalHoursWorked: "ชั่วโมงทำงานทั้งหมด",
  totalWorkDays: "วันทำงานทั้งหมด",
  totalShifts: "จำนวนกะทั้งหมด",
  averageHoursPerDay: "ชั่วโมงเฉลี่ย/วัน",
  dailyHoursOverview: "ภาพรวมชั่วโมงรายวัน",

  // Admin Dashboard
  allEmployees: "สไตลิสต์ทั้งหมด",
  selectEmployeePrompt: "เลือกสไตลิสต์เพื่อดูผลงาน",
  timeEntriesFor: (name: string) => `ผลงานของ ${name}`,
  noEntriesFound: "ไม่พบรายการสำหรับช่วงเวลานี้",
  addEntry: "เพิ่มรายการ",
  editEntry: "แก้ไขรายการ",
  deleteEntry: "ลบรายการ",
  confirmDelete: "ยืนยันการลบ",
  deleteConfirmationMessage: (entryInfo: string) => `คุณแน่ใจหรือไม่ว่าต้องการลบรายการเวลานี้? ${entryInfo}`,
  date: "วันที่",
  startTime: "เวลาเริ่มต้น",
  endTime: "เวลาสิ้นสุด",
  actions: "การกระทำ",
  workDays: "วันทำงาน",
  avgHours: "ชม.เฉลี่ย/วัน",
  overallSummary: "สรุปโดยรวม",
  employeeLeaderboard: "กระดานผู้นำพนักงาน",

  // Generic Actions
  close: "ปิด",
  save: "บันทึก",
  
  // Add/Edit Time Entry Modal
  addNewTimeEntry: "เพิ่มรายการเวลาใหม่",

  // Performance Review Modal
  editPerformanceReview: "แก้ไขการประเมินผลการปฏิบัติงาน",
  score: "คะแนน",
  comments: "ความคิดเห็น",
  
  // FIX: Add missing translations
  // Cart & Checkout
  yourCart: "ตะกร้าของคุณ",
  remove: "ลบ",
  emptyCart: "ตะกร้าของคุณว่างเปล่า",
  emptyCartPrompt: "ดูเหมือนว่าคุณยังไม่ได้เพิ่มอะไรลงในตะกร้า",
  subtotal: "ยอดรวม",
  checkout: "ดำเนินการชำระเงิน",
  addToCart: "เพิ่มลงตะกร้า",
  addedToCart: "เพิ่มแล้ว!",
  purchaseSuccessful: "ซื้อสำเร็จ!",
  purchaseSuccessfulMessage: "ขอบคุณสำหรับการสั่งซื้อของคุณ ได้ส่งการยืนยันไปยังอีเมลของคุณแล้ว",
  checkoutTitle: "ยืนยันการสั่งซื้อ",
  quantity: "จำนวน",
  total: "ทั้งหมด",
  confirmPurchase: "ยืนยันการซื้อ",

  // Admin Modals
  employee: "สไตลิสต์",
  selectEmployee: "เลือกสไตลิสต์",
  editEmployeeProfile: "แก้ไขโปรไฟล์สไตลิสต์",
  role: "ตำแหน่ง",
  admin: "ผู้จัดการ",
};


export const translations = { en, vi, th };

export const languageOptions = [
    { id: 'en', name: 'English' },
    { id: 'vi', name: 'Tiếng Việt' },
    { id: 'th', name: 'ไทย' },
];