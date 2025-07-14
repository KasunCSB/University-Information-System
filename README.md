# University Information System (UIS)

A modern, free, and open-source cloud-based Learning Management System designed specifically for Sri Lankan universities.

## 🎯 Vision

To provide a unified, accessible, and scalable platform that connects all universities across Sri Lanka, enabling students to upload assignments, receive evaluations, and access educational resources from anywhere.

## ✨ Features

- **Assignment Management**: Upload, submit, and track assignments with automated grading
- **Performance Analytics**: Comprehensive dashboards for academic progress monitoring
- **Course Materials**: Access lecture notes, videos, and resources from any device
- **Event Management**: Stay updated with university events and announcements
- **Collaborative Learning**: Discussion forums and group project tools
- **Secure Access**: University email verification and role-based access control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd uis
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Node.js + Express (planned)
- **Database**: MongoDB Atlas (planned)
- **Hosting**: GitHub Education + Azure Student Pack

## 🎓 Participating Universities

- University of Colombo (Est. 1921)
- University of Peradeniya (Est. 1942) 
- University of Kelaniya (Est. 1959)
- University of Moratuwa (Est. 1966)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
└── components/
    ├── LoadingScreen.tsx   # Loading animation
    ├── Header.tsx         # Navigation header
    ├── HeroSection.tsx    # Hero section
    └── FeaturesSection.tsx # Features showcase
```

## 🤝 Contributing

This is an open-source project welcoming contributions from developers across Sri Lanka. Please read our contributing guidelines before submitting pull requests.

## 📄 License

Open source and free for all Sri Lankan universities.

## 📞 Contact

For questions or collaboration opportunities, please reach out to the development team.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
