# Burmese Language Support Documentation

This document explains how Burmese language support has been implemented in the Offline Chess app.

## Files Updated

### 1. **index.html** (Updated)
Added proper Unicode and font support:

```html
<!-- UTF-8 Character Encoding -->
<meta charset="UTF-8">

<!-- Google Fonts - Pyidaungsu Font -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pyidaungsu&display=swap" rel="stylesheet">
```

**Why these changes:**
- `<meta charset="UTF-8">` ensures the browser correctly interprets Burmese Unicode characters
- Google Fonts Pyidaungsu provides proper rendering of Burmese script
- Preconnect links improve font loading performance

### 2. **src/index.css** (Updated)
Updated global font stack:

```css
body {
  font-family: 'Pyidaungsu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}
```

**Font Stack Priority:**
1. **Pyidaungsu** - Primary font for Burmese text
2. System fonts - Fallback for English and other languages
3. Generic sans-serif - Ultimate fallback

### 3. **src/App.css** (Updated)
Applied Pyidaungsu font to all text elements:

```css
.app-container {
  font-family: 'Pyidaungsu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.app-header h1 {
  font-family: 'Pyidaungsu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.language-toggle,
.sound-toggle,
.reset-button {
  font-family: 'Pyidaungsu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.game-status,
.app-footer {
  font-family: 'Pyidaungsu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

**Coverage:**
- ✅ Main container and headers
- ✅ All buttons and interactive elements
- ✅ Game status messages
- ✅ Footer text

## Burmese Text in App

### Translations Object (App.jsx)

```javascript
const translations = {
  en: { 
    title: "Offline Chess", 
    status: "Game in Progress", 
    switch: "Switch Language",
    gameOver: "Game Over",
    draw: "Draw",
    sound: "Sound",
    soundOn: "Sound On",
    soundOff: "Sound Off"
  },
  my: { 
    title: "အော့ဖ်လိုင်း စစ်တုရင်", 
    status: "ဂိမ်းကစားနေသည်", 
    switch: "ဘာသာစကားပြောင်းရန်",
    gameOver: "ဂိမ်းပြီးဆုံးသည်",
    draw: "ညီမျှသည်",
    sound: "အသံ",
    soundOn: "အသံ ဖွင့်",
    soundOff: "အသံ ပိတ်"
  }
}
```

### Burmese Translations

| English | Burmese | Description |
|---------|---------|-------------|
| Offline Chess | အော့ဖ်လိုင်း စစ်တုရင် | App title |
| Game in Progress | ဂိမ်းကစားနေသည် | Game status |
| Switch Language | ဘာသာစကားပြောင်းရန် | Language toggle button |
| Game Over | ဂိမ်းပြီးဆုံးသည် | Game end message |
| Draw | ညီမျှသည် | Draw result |
| Sound | အသံ | Sound label |
| Sound On | အသံ ဖွင့် | Sound enabled |
| Sound Off | အသံ ပိတ် | Sound disabled |
| New Game | နည်းလမ်းအသစ် | New game button |
| Drag pieces to move | အကွက်များကို ရွှေ့ခြင်းအတွက် ဆွဲခြင်း | Instructions |

## Browser Compatibility

| Browser | Burmese Support | Font Loading | Notes |
|---------|-----------------|--------------|-------|
| Chrome | ✅ Full | ✅ Google Fonts | Excellent support |
| Firefox | ✅ Full | ✅ Google Fonts | Excellent support |
| Safari | ✅ Full | ✅ Google Fonts | iOS 13+ recommended |
| Edge | ✅ Full | ✅ Google Fonts | Excellent support |
| Opera | ✅ Full | ✅ Google Fonts | Excellent support |

## Unicode Encoding

### UTF-8 Support
- **Meta charset**: `<meta charset="UTF-8">` ensures proper character encoding
- **Burmese Unicode Range**: U+1000 to U+109F
- **File Encoding**: All `.jsx` and `.js` files saved as UTF-8

### Burmese Unicode Characters

| Character | Unicode | Name |
|-----------|---------|------|
| အ | U+1000 | MYANMAR LETTER A |
| ခ | U+1001 | MYANMAR LETTER KHA |
| ဂ | U+1002 | MYANMAR LETTER GA |
| ဃ | U+1003 | MYANMAR LETTER GHA |
| ည | U+101A | MYANMAR LETTER NYA |
| တ | U+1010 | MYANMAR LETTER TA |

## Font Loading Performance

### Optimization Techniques

1. **Preconnect Links**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   ```
   - Establishes early connection to Google Fonts
   - Reduces font loading latency

2. **Font Display Strategy**
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Pyidaungsu&display=swap" rel="stylesheet">
   ```
   - `display=swap` shows fallback font immediately
   - Swaps to Pyidaungsu when loaded
   - Prevents layout shift

3. **Font Stack Fallback**
   - If Pyidaungsu fails to load, system fonts are used
   - English text still renders correctly
   - User experience not degraded

## Testing Burmese Display

### Manual Testing
1. Open the app in your browser
2. Click "Switch Language" button
3. Verify all Burmese text displays correctly
4. Check buttons and labels render properly
5. Test on mobile devices

### Debugging
If Burmese text doesn't display:

1. **Check charset in DevTools**
   - Open DevTools (F12)
   - Go to Elements tab
   - Verify `<meta charset="UTF-8">` is present

2. **Check font loading**
   - Open DevTools → Network tab
   - Look for `fonts.googleapis.com` requests
   - Verify Pyidaungsu font is loaded

3. **Check CSS**
   - Open DevTools → Elements tab
   - Inspect Burmese text element
   - Verify `font-family: 'Pyidaungsu'` is applied

4. **Check browser console**
   - Look for any CORS or font loading errors
   - Check for encoding issues

## Offline Support

The Service Worker caches:
- HTML with UTF-8 charset
- CSS with Pyidaungsu font stack
- All app files for offline access

**Note:** Pyidaungsu font from Google Fonts is cached after first load, enabling offline Burmese support.

## Accessibility

### Screen Reader Support
- Burmese text is properly encoded
- Screen readers can interpret Unicode characters
- Language attribute helps screen readers

### Keyboard Navigation
- All buttons support keyboard navigation
- Language switcher is keyboard accessible
- Tab order is logical

### Text Sizing
- Burmese text scales with browser zoom
- Responsive font sizes on mobile
- Maintains readability at all sizes

## Future Enhancements

Possible improvements:
- [ ] Add more Burmese translations
- [ ] Support for other Myanmar languages
- [ ] Burmese keyboard input
- [ ] Burmese number support
- [ ] RTL text support if needed

## Troubleshooting

### Issue: Burmese text shows as boxes or symbols
**Solution:**
- Ensure `<meta charset="UTF-8">` is in HTML head
- Clear browser cache and reload
- Check if Pyidaungsu font loaded (DevTools → Network)
- Try a different browser

### Issue: Font not loading from Google Fonts
**Solution:**
- Check internet connection
- Verify Google Fonts link is correct
- Check for CORS errors in console
- Try clearing browser cache

### Issue: Burmese text looks blurry
**Solution:**
- Increase font size in CSS
- Use `-webkit-font-smoothing: antialiased`
- Check browser zoom level
- Try different browser

### Issue: Text alignment is wrong
**Solution:**
- Burmese text is left-to-right (unlike Arabic)
- Check CSS text-align property
- Verify no RTL styling is applied
- Check for any CSS overrides

## Resources

### Burmese Language Resources
- [Burmese Unicode](https://en.wikipedia.org/wiki/Burmese_script)
- [Unicode Burmese Block](https://unicode.org/charts/PDF/U1000.pdf)
- [Google Fonts - Pyidaungsu](https://fonts.google.com/specimen/Pyidaungsu)

### Web Standards
- [UTF-8 Encoding](https://en.wikipedia.org/wiki/UTF-8)
- [HTML Meta Charset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
- [CSS Font Stack](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)

## Support

For issues with Burmese text display:
1. Check this documentation
2. Verify all files are UTF-8 encoded
3. Clear browser cache and reload
4. Test in different browser
5. Check browser console for errors

---

**Last Updated:** 2024
**Burmese Font:** Pyidaungsu (Google Fonts)
**Character Encoding:** UTF-8
