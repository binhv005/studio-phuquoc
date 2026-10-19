// Thông tin doanh nghiệp — giữ nguyên theo brief, không chỉnh sửa tự ý.
export const site = {
  brand: 'Studio Bin',
  fullName: 'Photographer Phu Quoc – Studio Bin',
  contactName: 'Danh Lý',
  phoneDisplay: '0384 038 453',
  phoneTel: 'tel:0384038453',
  address: 'Khu phố 9, Phú Quốc, An Giang, Việt Nam',
  facebook: 'https://www.facebook.com/PhotographerPhuQuocs',
  maps: 'https://maps.app.goo.gl/zT888PU8bKJ9nmje8',
  // Điền URL dịch vụ nhận form (Formspree, Getform, backend riêng...) vào .env: VITE_FORM_ENDPOINT=...
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
};
