const form = document.querySelector("#download-form");
const input = document.querySelector("#video-url");
const button = document.querySelector("#download-btn");
const message = document.querySelector("#message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  message.className = "message";

  let url;
  try {
    url = new URL(input.value.trim());
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol");
  } catch {
    message.textContent = "সঠিক HTTP বা HTTPS ভিডিও URL দিন।";
    message.classList.add("error");
    return;
  }

  // GitHub Pages is static hosting: it cannot fetch/proxy third-party page URLs.
  // Direct video file URLs are handed to the browser's download mechanism.
  const path = url.pathname.toLowerCase();
  const looksLikeVideo = /\.(mp4|webm|mov|m4v|ogv|avi|mkv)(?:$)/i.test(path);

  if (!looksLikeVideo) {
    message.textContent = "এটি সরাসরি ভিডিও ফাইলের লিংক বলে মনে হচ্ছে না। .mp4 বা .webm ফাইলের URL দিন। YouTube/Facebook পেজ URL এই স্ট্যাটিক সাইটে কাজ করবে না।";
    message.classList.add("error");
    return;
  }

  button.disabled = true;
  button.innerHTML = "Opening…";
  try {
    const a = document.createElement("a");
    a.href = url.href;
    a.download = decodeURIComponent(path.split("/").pop() || "video");
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    message.textContent = "ডাউনলোড শুরু করার অনুরোধ পাঠানো হয়েছে। ব্রাউজার ফাইলটি খুললে, মেনু থেকে Save করুন।";
  } catch {
    message.textContent = "ডাউনলোড শুরু করা যায়নি। লিংকটি পরীক্ষা করে আবার চেষ্টা করুন।";
    message.classList.add("error");
  } finally {
    button.disabled = false;
    button.innerHTML = "<span>↓</span> Download";
  }
});
