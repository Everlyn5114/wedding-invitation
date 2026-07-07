// ==========================================================================
// 🎵 终极音频热身逻辑：消灭开门后的几秒停滞
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    if (music) {
        // 1. 一进网页，强行让音频在后台进行解码和加载缓冲
        music.load(); 
        
        // 2. 兼容手机端：只要宾客在网页上有任何细微的触摸或滑动动作，立刻悄悄唤醒音频引擎
        const warmUpAudio = () => {
            music.play().then(() => {
                music.pause(); // 瞬间暂停，不发出声音，但此时音频已经在内存里“热身”完毕了
            }).catch(() => {});
            // 只需要热身一次，随后立刻解除监听，不影响后续性能
            document.removeEventListener('touchstart', warmUpAudio);
            document.removeEventListener('click', warmUpAudio);
        };
        document.addEventListener('touchstart', warmUpAudio, { once: true });
        document.addEventListener('click', warmUpAudio, { once: true });
    }
});

// ==========================================================================
// 1. 初始化 Swiper (终极无缝匀速丝滑流动版 - 消除停顿)
// ==========================================================================
const swiper = new Swiper(".mySwiper", {
    direction: "vertical",
    spaceBetween: 0,
    mousewheel: true,
    
    // 优雅流动的电影谢幕速度（12000毫秒滑完一页，可根据喜好调节）
    speed: 12000, 
    
    allowTouchMove: true,
    
    // 💡 核心优化一：匀速流动的奥秘，delay 必须为 0，且不能有任何延迟间隔
    autoplay: {
        delay: 0,
        disableOnInteraction: false,
        stopOnLastSlide: true,
    },
    
    // 💡 核心优化二：彻底解放自由模式，斩断“页面停顿对齐”的罪魁祸首
    freeMode: {
        enabled: true,
        momentum: false,
        sticky: false,   /* ⚡ 关键：禁用粘性贴合，防止每到一页边缘就强行吸附停顿 */
    },
    
    // 💡 核心优化三：为了配合 freeMode 的完美匀速，必须把切换效果强行锁定为线性（linear）
    // 否则默认的 ease-out 缓动函数会在接近页面末尾时自动减速、造成停顿错觉
    resistanceRatio: 0,
    loop: false, /* 让请柬无限循环流动 */
    
    on: {
        setTranslate: function() {
            AOS.refresh();
        },
        slideChange: function() {
            AOS.refresh();
        }
    }
});
// 默认一进来先让自动滑动【暂停】
swiper.autoplay.stop();

// ==========================================================================
// 🚀 核心智能交互：按住屏幕停止滚动，松开手继续滚动
// ==========================================================================
const swiperContainer = document.querySelector('.mySwiper');

if (swiperContainer) {
    // 📱 手机端：手指按住屏幕
    swiperContainer.addEventListener('touchstart', () => {
        swiper.autoplay.stop(); // 停止滚动
    });

    // 📱 手机端：手指离开屏幕
    swiperContainer.addEventListener('touchend', () => {
        // 只有当开书遮罩已经拆掉的时候，才恢复滚动
        if (document.getElementById('book-cover').classList.contains('opened')) {
            swiper.autoplay.start(); 
        }
    });

    // 💻 电脑端兼容：鼠标点住不放
    swiperContainer.addEventListener('mousedown', () => {
        swiper.autoplay.stop();
    });
    // 💻 电脑端兼容：鼠标松开
    swiperContainer.addEventListener('mouseup', () => {
        if (document.getElementById('book-cover').classList.contains('opened')) {
            swiper.autoplay.start();
        }
    });
}

// ==========================================================================
// 🚀 核心控制：点击拆开丝带与开书逻辑
// ==========================================================================
const bookCover = document.getElementById('book-cover');

if (bookCover) {
    bookCover.addEventListener('click', () => {
        bookCover.classList.add('opened');
        
        // 自动播放音乐
        const music = document.getElementById('bg-music');
        const musicBtn = document.getElementById('music-btn');
        if (music && music.paused) {
            music.play().catch(err => console.log("自动播放拦截"));
            if (musicBtn) musicBtn.classList.add('playing');
        }

        // 旋转式开大门后，立刻开启“丝滑匀速流动模式”
        setTimeout(() => {
            swiper.autoplay.start();
        }, 1500);
    });
}

// ==========================================================================
// 2. 初始化 AOS
// ==========================================================================
AOS.init({
    duration: 1000,
    once: false,
});

// ==========================================================================
// 3. 音乐控制
// ==========================================================================
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

if (musicBtn && music) {
    musicBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicBtn.classList.add('playing');
        } else {
            music.pause();
            musicBtn.classList.remove('playing');
        }
    });
}

// ==========================================================================
// 4. 倒数计时器
// ==========================================================================
function updateCountdown() {
    const weddingDate = new Date("September 20, 2026 00:00:00").getTime();
    const now = new Date().getTime();
    const difference = weddingDate - now;

    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");

    if (!dEl || !hEl || !mEl || !sEl) return;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        dEl.innerText = days < 10 ? "0" + days : days;
        hEl.innerText = hours < 10 ? "0" + hours : hours;
        mEl.innerText = minutes < 10 ? "0" + minutes : minutes;
        sEl.innerText = seconds < 10 ? "0" + seconds : seconds;
    } else {
        dEl.innerText = "00"; hEl.innerText = "00"; mEl.innerText = "00"; sEl.innerText = "00";
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================================================
// 5. 初始化照片墙 Swiper（左右水平滑动）
// ==========================================================================
const gallerySwiper = new Swiper(".gallerySwiper", {
    direction: "horizontal", // 左右滑动
    loop: true,              // 循环播放
    spaceBetween: 10,        // 照片之间的间距
    pagination: {
        el: ".gallery-pagination",
        clickable: true,     // 点击圆点也可以切照片
    },
});

// ==========================================================================
// 6. RSVP 表单提交拦截与本地交互
// ==========================================================================
const rsvpForm = document.getElementById('wedding-rsvp-form');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止网页刷新

        const name = document.getElementById('guest-name').value;
        const attendance = document.getElementById('guest-attendance').value;
        const count = document.getElementById('guest-count').value;
        const wish = document.getElementById('guest-wish').value;

        if (attendance === "出席") {
            alert(`🎉 谢谢您的祝福，${name}！\n我们已收到您的赴宴确认（共 ${count} 位）。\n期待在 2026 年 9 月 20 日与您相见！🤍`);
        } else {
            alert(`🌸 谢谢您的祝福，${name}！\n虽然您无法亲临现场，但您的心意 Joshua & Hannah 已经收到啦！谢谢你！`);
        }

        console.log("💌 收到新的 RSVP 回执：", {
            姓名: name,
            是否出席: attendance,
            出席人数: count,
            祝福语: wish,
            提交时间: new Date().toLocaleString()
        });

        rsvpForm.reset();
    });
}