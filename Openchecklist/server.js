const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

// Try to load markdown-pdf for on-demand conversion
let markdownpdf;
try {
    markdownpdf = require('markdown-pdf');
} catch (e) {
    console.log('Note: markdown-pdf not installed. PDF generation disabled.');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample checklist data with file mappings
const checklists = [
    {
        id: 1,
        title: "Food Truck Business Checklist",
        description: "Complete guide to launching your food truck from concept to first sale",
        icon: "🚚",
        downloads: 3420,
        contributors: 12,
        lastUpdated: "2 days ago",
        version: "2.1",
        formats: {
            pdf: "food-truck-checklist-v2.1.pdf",
            markdown: "food-truck-checklist-v2.1.md",
            excel: "food-truck-checklist-v2.1.xlsx"
        },
        features: [
            "150+ step checklist",
            "Permit templates",
            "Menu planning tools",
            "Supplier directory"
        ]
    },
    {
        id: 2,
        title: "Therapy Practice Checklist",
        description: "Step-by-step guide to starting your independent therapy practice",
        icon: "🧠",
        downloads: 2150,
        contributors: 8,
        lastUpdated: "1 week ago",
        version: "1.8",
        formats: {
            pdf: "therapy-practice-checklist-v1.8.pdf",
            markdown: "therapy-practice-checklist-v1.8.md",
            word: "therapy-practice-checklist-v1.8.docx"
        },
        features: [
            "200+ step checklist",
            "Insurance forms",
            "Client intake templates",
            "HIPAA compliance guide"
        ]
    },
    {
        id: 3,
        title: "Podcast Production Workflow",
        description: "Professional podcast setup and production system",
        icon: "🎙️",
        downloads: 5670,
        contributors: 15,
        lastUpdated: "3 days ago",
        version: "3.0",
        formats: {
            pdf: "podcast-workflow-v3.0.pdf",
            markdown: "podcast-workflow-v3.0.md",
            notion: "podcast-workflow-v3.0.csv"
        },
        features: [
            "Equipment checklist",
            "Recording templates",
            "Editing workflow",
            "Distribution guide"
        ]
    },
    {
        id: 4,
        title: "Specialty Retail Shop Package",
        description: "Everything you need to open your boutique retail store",
        icon: "🏪",
        downloads: 1890,
        contributors: 6,
        lastUpdated: "5 days ago",
        version: "1.5",
        formats: {
            pdf: "retail-shop-checklist-v1.5.pdf",
            excel: "retail-shop-checklist-v1.5.xlsx",
            googlesheets: "retail-shop-checklist-v1.5.csv"
        },
        features: [
            "175+ step checklist",
            "Inventory templates",
            "POS setup guide",
            "Marketing calendar"
        ]
    },
    {
        id: 5,
        title: "Freelance Designer Toolkit",
        description: "Complete system for launching and managing your design business",
        icon: "🎨",
        downloads: 4320,
        contributors: 10,
        lastUpdated: "1 day ago",
        version: "2.5",
        formats: {
            pdf: "designer-toolkit-v2.5.pdf",
            figma: "designer-toolkit-v2.5.fig",
            notion: "designer-toolkit-v2.5.csv"
        },
        features: [
            "Client onboarding process",
            "Contract templates",
            "Pricing calculator",
            "Portfolio guidelines"
        ]
    },
    {
        id: 6,
        title: "Online Course Creation",
        description: "Build and launch your online course from scratch",
        icon: "📚",
        downloads: 6890,
        contributors: 18,
        lastUpdated: "4 days ago",
        version: "4.0",
        formats: {
            pdf: "course-creation-v4.0.pdf",
            markdown: "course-creation-v4.0.md",
            trello: "course-creation-v4.0.csv"
        },
        features: [
            "Course planning framework",
            "Video production checklist",
            "Marketing templates",
            "Student engagement tools"
        ]
    }
];

// API Routes

// Get all checklists
app.get('/api/checklists', (req, res) => {
    res.json(checklists);
});

// Get single checklist
app.get('/api/checklists/:id', (req, res) => {
    const checklist = checklists.find(c => c.id === parseInt(req.params.id));
    if (!checklist) {
        return res.status(404).json({ error: 'Checklist not found' });
    }
    res.json(checklist);
});

// Download checklist file
app.get('/api/download/:id/:format', async (req, res) => {
    const { id, format } = req.params;
    const checklist = checklists.find(c => c.id === parseInt(id));
    
    if (!checklist) {
        return res.status(404).json({ error: 'Checklist not found' });
    }
    
    const filename = checklist.formats[format.toLowerCase()];
    if (!filename) {
        return res.status(404).json({ error: 'Format not available' });
    }
    
    const filePath = path.join(__dirname, 'checklists', filename);
    
    try {
        // Check if file exists
        await fs.access(filePath);
        
        // Update download count
        checklist.downloads += 1;
        
        // Set appropriate headers
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Set content type based on format
        const contentTypes = {
            pdf: 'application/pdf',
            markdown: 'text/markdown',
            md: 'text/markdown',
            excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            csv: 'text/csv',
            fig: 'application/octet-stream'
        };
        
        const ext = path.extname(filename).slice(1);
        res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
        
        // Send file
        res.sendFile(filePath);
        
    } catch (error) {
        console.error('File not found:', filePath);
        
        // Try to generate PDF from markdown if it's a PDF request
        if (format.toLowerCase() === 'pdf' && markdownpdf) {
            const mdFilename = filename.replace('.pdf', '.md');
            const mdPath = path.join(__dirname, 'checklists', mdFilename);
            
            try {
                await fs.access(mdPath);
                console.log('Generating PDF from markdown...');
                
                // Generate PDF on the fly
                const pdfPath = filePath;
                await new Promise((resolve, reject) => {
                    markdownpdf()
                        .from(mdPath)
                        .to(pdfPath, function (err) {
                            if (err) reject(err);
                            else resolve();
                        });
                });
                
                // Now send the generated PDF
                res.sendFile(pdfPath);
                return;
            } catch (mdError) {
                console.error('Markdown file not found or PDF generation failed');
            }
        }
        
        // If all else fails, create a sample file
        const sampleContent = await generateSampleChecklist(checklist, format);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'text/plain');
        res.send(sampleContent);
    }
});

// Get download statistics
app.get('/api/stats', (req, res) => {
    const totalDownloads = checklists.reduce((sum, c) => sum + c.downloads, 0);
    const totalChecklists = checklists.length;
    const totalContributors = new Set(checklists.flatMap(c => Array(c.contributors).fill(1))).size;
    
    res.json({
        totalChecklists,
        totalDownloads,
        totalContributors: 187, // Mock data
        updateFrequency: 'Weekly'
    });
});

// Generate sample checklist content if file doesn't exist
async function generateSampleChecklist(checklist, format) {
    const content = `# ${checklist.title}

Version: ${checklist.version}
Last Updated: ${checklist.lastUpdated}

## Description
${checklist.description}

## Features Included:
${checklist.features.map(f => `- ${f}`).join('\n')}

## Main Checklist

### Phase 1: Planning and Research
- [ ] Define your concept and unique value proposition
- [ ] Research target market and competition
- [ ] Create business plan and financial projections
- [ ] Identify startup costs and funding sources

### Phase 2: Legal and Regulatory
- [ ] Choose business structure (LLC, Corporation, etc.)
- [ ] Register business name and obtain EIN
- [ ] Apply for necessary permits and licenses
- [ ] Set up business bank accounts
- [ ] Obtain required insurance policies

### Phase 3: Operations Setup
- [ ] Secure location or equipment
- [ ] Set up supplier relationships
- [ ] Develop standard operating procedures
- [ ] Create quality control systems
- [ ] Implement inventory management

### Phase 4: Marketing and Launch
- [ ] Develop brand identity and materials
- [ ] Create website and social media presence
- [ ] Plan grand opening or launch event
- [ ] Implement customer feedback system
- [ ] Begin operations and iterate based on feedback

---

This is a sample checklist. The full version includes:
- Detailed sub-checklists for each phase
- Templates and forms
- Resource links
- Common pitfalls to avoid
- Industry-specific guidance

## License
This checklist is licensed under CC BY 4.0. You are free to use, modify, and share it.

## Contribute
Help improve this checklist at github.com/openchecklist/${checklist.title.toLowerCase().replace(/\s+/g, '-')}
`;
    
    return content;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`OpenChecklist server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the site`);
});

// Create checklists directory if it doesn't exist
const setupDirectories = async () => {
    try {
        await fs.mkdir(path.join(__dirname, 'checklists'), { recursive: true });
        await fs.mkdir(path.join(__dirname, 'public'), { recursive: true });
        console.log('Directories created successfully');
    } catch (error) {
        console.error('Error creating directories:', error);
    }
};

setupDirectories();