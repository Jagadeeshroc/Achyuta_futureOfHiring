// utils/imageUtils.js
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /, prepend the backend URL
  if (imagePath.startsWith('/')) {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}${imagePath}`;
  }
  
  // If it's a local file path, try to extract filename and construct URL
  if (imagePath.includes('freelance')) {
    const filename = imagePath.split('/').pop() || imagePath.split('\\').pop();
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/freelance/${filename}`;
  }
  
  // Default case
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/freelance/${imagePath}`;
};