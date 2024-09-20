## Image Converter

This project provides a simple image converter built with Next.js. It allows users to select multiple images, choose a conversion format (WebP, PNG, JPEG, or AVIF), and optionally adjust the compression level for JPEG and WebP. The converted images are then downloaded as a ZIP archive.

### Usage

1. **Upload Images:** Select multiple images using the file input field.
2. **Choose Conversion Format:** Select the desired conversion format from the dropdown menu.
3. **Adjust Compression Level (Optional):** For JPEG and WebP, adjust the compression level using the slider. Lower values result in higher quality but larger file sizes.
4. **Convert:** Click the 'Convert' button to start the conversion process. A progress bar will display the conversion status.
5. **Download:** Once the conversion is complete, a ZIP archive containing the converted images will be downloaded automatically.

### Code Structure

The project uses the following code structure:

- **`src/app/page.tsx`:** Renders the main component containing the image upload form and the conversion controls.
- **`src/components/layout/ImageFormUpload.tsx`:** Houses the form logic and handles the conversion process using `fetch` to call the API route.
- **`src/app/api/convert/route.ts`:**  An API route that receives the uploaded image, format, and optional compression level. It converts the image using the `sharp` library and returns the converted image as a response.
- **`src/components/layout/Header.tsx`:**  Renders the header with a navigation bar and a theme toggle.
- **`src/components/layout/Navbar.tsx`:**  Implements the navigation bar with links to the GitHub repository, X profile, and a 'Support this Project' button.
- **`src/components/layout/ModeToggle.tsx`:** Provides a button to switch between light and dark themes.
- **`src/components/layout/ThemeProvider.tsx`:**  Wraps the application with the `next-themes` component to enable theme switching.
- **`src/components/ui`:** Contains reusable UI components such as buttons, inputs, labels, alerts, progress bars, selects, and sliders.
- **`src/lib/utils.ts`:** Provides a helper function (`cn`) for combining Tailwind CSS classes.
