
'use server';

import mammoth from 'mammoth';

type ProcessedFileResult = {
    content?: string;
    title?: string;
    error?: string;
}

export async function processFiles(formData: FormData): Promise<ProcessedFileResult> {
    const files = formData.getAll('files') as File[];
    if (files.length === 0) {
        return { error: 'No files uploaded.' };
    }

    let combinedContent = '';
    let firstFileName = '';

    for (const file of files) {
        if (!firstFileName) {
            firstFileName = file.name.replace(/\.[^/.]+$/, '');
        }
        try {
            let textContent = '';
            const arrayBuffer = await file.arrayBuffer();
            
            if (file.type === 'application/pdf') {
                try {
                    const pdf = (await import('pdf-parse')).default;
                    const data = await pdf(Buffer.from(arrayBuffer));
                    textContent = data.text;
                } catch (error) {
                    console.warn(`Error parsing PDF: ${error}. Skipping file: ${file.name}`);
                    continue;
                }
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const result = await mammoth.extractRawText({ arrayBuffer });
                textContent = result.value;
            } else if (file.type === 'text/plain') {
                textContent = Buffer.from(arrayBuffer).toString('utf-8');
            } else {
                 console.warn(`Unsupported file type: ${file.type}. Skipping file: ${file.name}`);
                 continue; // Skip unsupported files
            }

            const htmlContent = textContent
                .split('\n')
                .filter(line => line.trim() !== '')
                .map(p => `<p>${p.trim()}</p>`)
                .join('');
                
            combinedContent += htmlContent;
        } catch (error) {
            console.error('Error reading file:', file.name, error);
            return { error: `Could not read content from ${file.name}. It might be a binary file or corrupted.` };
        }
    }
    
    return { content: combinedContent, title: firstFileName };
}
