/**
 * Fallback compression when Sharp is not available
 */

function createFallbackCompression() {
  return {
    async compressImage(photoFile, compressionSettings) {
      console.log('⚠️ Using fallback compression (Sharp not available)');
      
      // Return original file with minimal processing
      return {
        buffer: photoFile.buffer,
        size: photoFile.size,
        name: photoFile.name.replace(/\.[^/.]+$/, '.jpg') // Ensure .jpg extension
      };
    }
  };
}

module.exports = createFallbackCompression;
