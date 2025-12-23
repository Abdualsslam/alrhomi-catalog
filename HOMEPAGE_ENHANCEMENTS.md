# تحسينات احترافية للصفحة الرئيسية

## 🎨 التحسينات المقترحة

### 1. إضافة Parallax Scrolling Effect

```typescript
const [scrollY, setScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// في Hero Section
<Box
  sx={{
    transform: `translateY(${scrollY * 0.5}px)`,
    transition: 'transform 0.1s ease-out',
  }}
>
```

### 2. Stats Counter Component (عداد متحرك)

```typescript
// مكون جديد: StatsCounter.tsx
import { useEffect, useState, useRef } from "react";

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return { count, ref };
};
```

### 3. Glassmorphism المحسّن

```typescript
// في FeatureCard
sx={{
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
}}
```

### 4. Scroll Reveal Animation

```typescript
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};
```

### 5. Magnetic Button Effect

```typescript
const MagneticButton = ({ children, ...props }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.2s ease-out",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
```

### 6. Animated Background Gradient

```typescript
// في Hero Section
<Box
  sx={{
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at 20% 50%, ${alpha(
        theme.palette.primary.main,
        0.15
      )} 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, ${alpha(
        theme.palette.secondary.main,
        0.15
      )} 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, ${alpha(
        theme.palette.info.main,
        0.1
      )} 0%, transparent 50%)
    `,
    animation: "gradient-shift 15s ease infinite",
    "@keyframes gradient-shift": {
      "0%, 100%": { opacity: 1 },
      "50%": { opacity: 0.7 },
    },
  }}
/>
```

### 7. Floating Action Button مع Tooltip

```typescript
<Fab
  color="success"
  sx={{
    position: "fixed",
    bottom: 24,
    left: 24,
    zIndex: 1000,
    animation: "float 3s ease-in-out infinite",
    boxShadow: `0 8px 30px ${alpha(theme.palette.success.main, 0.4)}`,
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: `0 12px 40px ${alpha(theme.palette.success.main, 0.6)}`,
    },
  }}
  onClick={() => window.open("https://wa.me/967775017485", "_blank")}
>
  <WhatsApp />
</Fab>
```

### 8. Testimonials Carousel (شهادات العملاء)

```typescript
const testimonials = [
  {
    name: "أحمد محمد",
    role: "مدير مطعم",
    text: "خدمة ممتازة ومنتجات عالية الجودة",
    rating: 5,
  },
  // المزيد...
];

<Swiper
  modules={[Autoplay, Pagination]}
  spaceBetween={30}
  slidesPerView={1}
  autoplay={{ delay: 5000 }}
  pagination={{ clickable: true }}
>
  {testimonials.map((testimonial, index) => (
    <SwiperSlide key={index}>
      <TestimonialCard {...testimonial} />
    </SwiperSlide>
  ))}
</Swiper>;
```

### 9. Interactive Product Preview

```typescript
<Card
  sx={{
    position: "relative",
    overflow: "hidden",
    "&:hover .product-overlay": {
      opacity: 1,
      transform: "translateY(0)",
    },
  }}
>
  <CardMedia component="img" image={product.image} />
  <Box
    className="product-overlay"
    sx={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      opacity: 0,
      transform: "translateY(20px)",
      transition: "all 0.4s ease",
      display: "flex",
      alignItems: "flex-end",
      p: 3,
    }}
  >
    <Stack spacing={1}>
      <Typography variant="h6" color="white">
        {product.name}
      </Typography>
      <Button variant="contained" size="small">
        عرض التفاصيل
      </Button>
    </Stack>
  </Box>
</Card>
```

### 10. Loading Skeleton محسّن

```typescript
<Skeleton
  variant="rectangular"
  sx={{
    borderRadius: 4,
    "&::after": {
      background: `linear-gradient(90deg, transparent, ${alpha(
        theme.palette.primary.main,
        0.2
      )}, transparent)`,
    },
  }}
/>
```

## 📦 مكتبات إضافية مقترحة

```bash
npm install framer-motion swiper aos react-intersection-observer
```

### استخدام Framer Motion

```typescript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  <Typography variant="h2">عنوان متحرك</Typography>
</motion.div>;
```

### استخدام AOS (Animate On Scroll)

```typescript
import AOS from "aos";
import "aos/dist/aos.css";

useEffect(() => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  });
}, []);

<Box data-aos="fade-up" data-aos-delay="200">
  <FeatureCard />
</Box>;
```

## 🎯 CSS Animations الإضافية

```css
@keyframes blob {
  0%,
  100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
}

@keyframes glow {
  0%,
  100% {
    filter: drop-shadow(0 0 20px rgba(var(--primary-rgb), 0.5));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(var(--primary-rgb), 0.8));
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

## 🚀 Performance Tips

1. **Lazy Loading للصور**

```typescript
<img loading="lazy" src={image} alt={alt} />
```

2. **Code Splitting**

```typescript
const CategoryShowcase = lazy(() => import("../components/CategoryShowcase"));
```

3. **Memoization**

```typescript
const MemoizedFeatureCard = memo(FeatureCard);
```

4. **Virtual Scrolling للقوائم الطويلة**

```typescript
import { FixedSizeList } from "react-window";
```

## 📱 Responsive Enhancements

```typescript
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

// استخدام breakpoints مخصصة
sx={{
  fontSize: {
    xs: '1rem',
    sm: '1.2rem',
    md: '1.5rem',
    lg: '2rem',
  },
  padding: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 6,
  },
}}
```

## 🎨 Color Palette المحسّنة

```typescript
const enhancedTheme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
      light: "#a8b5ff",
      dark: "#4c5fd5",
    },
    secondary: {
      main: "#f093fb",
      light: "#ffc4ff",
      dark: "#c56cc8",
    },
    success: {
      main: "#4ade80",
      light: "#86efac",
      dark: "#22c55e",
    },
    gradient: {
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      success: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
    },
  },
});
```

## ✨ Micro-interactions

```typescript
// Button Ripple Effect
<Button
  sx={{
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 0,
      height: 0,
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.5)",
      transform: "translate(-50%, -50%)",
      transition: "width 0.6s, height 0.6s",
    },
    "&:active::before": {
      width: "300px",
      height: "300px",
    },
  }}
>
  انقر هنا
</Button>
```

---

## 📝 ملاحظات التطبيق

1. احفظ جميع الملفات المفتوحة في المحرر
2. قم بتطبيق التحسينات تدريجياً
3. اختبر الأداء بعد كل تحسين
4. استخدم React DevTools لمراقبة الأداء
5. تأكد من التوافق مع جميع المتصفحات
