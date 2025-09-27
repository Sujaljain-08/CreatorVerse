export const getPublicIdFromUrl = function(url) {
    
  const versionRegex = /v\d+\//;
  const match = url.match(versionRegex);

  if (!match) {
    // Fallback if no version number is in the URL (less common)
    const parts = url.split('/upload/');
    if(parts.length < 2) return null;
    const path = parts[1];
    return path.substring(0, path.lastIndexOf('.'));
  }

  const fullPath = url.substring(match.index + match[0].length);

  const publicId = fullPath.substring(0, fullPath.lastIndexOf('.'));

  return publicId;
}