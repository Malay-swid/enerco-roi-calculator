# ⚡ Enerco Industrial Energy ROI Calculator

A professional B2B lead-generation tool and corporate presence for **Enerco**, a renewable energy consulting firm. This application allows industrial enterprises to calculate their potential energy savings and payback periods when transitioning to renewable energy sources.

## 🚀 Key Features
- **Multi-Step Wizard:** Intuitive user flow from energy profile $\rightarrow$ investment $\rightarrow$ optimization $\rightarrow$ lead capture.
- **Financial Projection:** Real-time calculation of annual savings and payback periods.
- **Interactive Visualization:** 10-year cumulative ROI chart built with **Recharts**, featuring a clear break-even point analysis.
- **Lead Generation Funnel:** Gated results to ensure high-quality lead capture for B2B consulting.
- **Corporate Industrial Aesthetic:** High-trust UI using a Deep Navy and Emerald Green palette, built with **Tailwind CSS**.

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide-React

## 💻 Local Setup
1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/Malay-swid/enerco-roi-calculator.git
   cd enerco-roi-calculator
   \`\`\`
2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`
3. **Start the development server:**
   \`\`\`bash
   npm start
   \`\`\`
4. **View the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📈 Financial Logic
The calculator uses the following formulas:
- **Annual Savings** = $(\text{Average Monthly Bill} \times 12) \times (\text{Saving } \% / 100)$
- **Payback Period** = $\frac{\text{Total Investment}}{\text{Annual Savings}}$
