# Noted

A modern, clean note-taking application built with Next.js, featuring customizable themes and an intuitive interface.

## 📸 Screenshots

<details>
<summary>Click to expand screenshots</summary>

### Home Page

![image](https://github.com/user-attachments/assets/335b6a00-a20c-4f8f-bcbe-b1418c3c8396)

### Themes

![image](https://github.com/user-attachments/assets/21b9eea9-5c34-4b1a-9c0c-34f72f771006)
![image](https://github.com/user-attachments/assets/461e417c-599c-45dd-9411-04fd896d1cb2)
![image](https://github.com/user-attachments/assets/bff553b6-f50d-47c2-b226-587abec77bad)
![image](https://github.com/user-attachments/assets/96e0afa7-4139-4d9f-a143-3d4c4e42d36d)

and many more!

### Interface

![image](https://github.com/user-attachments/assets/a230c0e8-970e-4af6-ba58-dd93c59dfa7f)

</details>

## ✨ Features

- 📝 Clean and intuitive note-taking interface
- 🎨 NotedAI - Intelligent AI assistant for enhanced note-taking
- 🎨 End-to-end AES encryption with unique user keys
- 🎨 Customizable themes (Light/Dark mode)
- 🔒 Secure user authentication
- 📱 Responsive design for all devices
- ⚡ Real-time updates and autosave
- 🗂️ Organized sidebar navigation
- 🔍 Quick search functionality

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - For type-safe code
- [Tailwind CSS](https://tailwindcss.com/) - For styling and theming
- [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [TipTap](https://tiptap.dev/) - Rich text editor with extensions
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) - Beautiful typographic defaults
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Media management
- [Lucide React](https://lucide.dev/) - Beautiful icons

## 📝 Project Structure

```
├── app/
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Auth/      # Authentication components
│   ├── Header/    # App header with navigation
│   ├── Footer/    # App footer
│   └── Sidebar/   # Note navigation sidebar
└── public/        # Static assets
```

## 🔗 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔐 Security

All notes in Noted are encrypted using AES encryption. Each user has their own unique encryption key, ensuring that:

- Notes are encrypted before being stored in the database
- Only the note owner can decrypt and read their notes
- Even if the database is compromised, the notes remain secure
- The encryption/decryption process is completely transparent to users

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
