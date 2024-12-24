import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { CodeBlock } from './CodeBlock';
import * as JSZip from 'jszip';
//import { saveAs } from 'file-saver';
import { saveAs } from 'file-saver';

interface ChatMessageProps {
  message: Message;
  userAvatar: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, userAvatar }) => {
  const isUser = message.role === 'user';
  const avatarSrc = isUser 
    ? (userAvatar || 'https://media.istockphoto.com/id/2175792656/photo/male-user-profile-3d-illustration.jpg?s=1024x1024&w=is&k=20&c=xJ3DKm-JdFejVQFDRItNvfew7IVFaBNY7tTZ2cHxQWE=') 
    : 'https://media.istockphoto.com/id/1345658982/photo/ai-microprocessor-on-motherboard-computer-circuit.jpg?s=1024x1024&w=is&k=20&c=SIzGFhl8DDCxaBUXkAOegQ9TecRA3Qp2vbJi5LCXtBU=';

  const processMessageContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index),
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex),
      });
    }

    return parts;
  };

  const messageParts = processMessageContent(message.content);
/**
  // Function to convert text to .pptx and download
function textToPptx(text: string, fileName: string = 'output') {
  // Break down the problem into manageable parts
  // 1. **Generate Presentation XML**:
  //    - Simplified approach: One slide per text block (newline separated)
  const slides = text.split('\n\n'); // Assuming double newline separates slides

  // 2. **Create PowerPoint XML Structure**:
  //    - Simplified: Focus on core elements (slide, shape, text)
  const pptxXML = slides.map((slideText, index) => `
      <sld xmlns="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
          <sldLayoutIdLst>
              <sldLayoutIdLst>1</sldLayoutIdLst>
          </sldLayoutIdLst>
          <spTree>
              <nvGrpSpPr>
                  <cNvPr id="2" name=""/>
                  <cNvGrpSpPr/>
                  <nvPr/>
              </nvGrpSpPr>
              <grpSpPr>
                  <xfrm>
                      <off x="0" y="0"/>
                      <ext cx="0" cy="0"/>
                      <chwLeft="0" chRight="0"/>
                      <chId="1"/>
                  </xfrm>
              </grpSpPr>
              <sp>
                  <nvSpPr>
                      <cNvPr id="4" name="Title"/>
                      <cNvSpPr>
                          <spLocks noGrp="1"/>
                      </cNvSpPr>
                      <nvPr>
                          <ph type="title" idx="0"/>
                      </nvPr>
                  </nvSpPr>
                  <spPr>
                      <xfrm>
                          <off x="457200" y="1122300"/>
                          <ext cx="9144000" cy="457200"/>
                      </xfrm>
                  </spPr>
                  <txBody>
                      <bodyPr rtlCol="0" anchor="ctr">
                          <spAutoFit/>
                      </bodyPr>
                      <lstStyle>
                          <defPPr>
                              <defRPr>
                                  <sz val="1800"/>
                                  <latin typeface="+mn-lt"/>
                                  <cs typeface="Arial"/>
                              </defRPr>
                          </defPPr>
                      </lstStyle>
                      <p>
                          <r>
                              <rPr lang="en-US" smtClean="0">
                                  <sz val="1800"/>
                                  <latin typeface="+mn-lt"/>
                                  <cs typeface="Arial"/>
                              </rPr>
                              <t>${slideText}</t>
                          </r>
                          <endParaRPr lang="en-US" smtClean="0">
                              <sz val="1800"/>
                              <latin typeface="+mn-lt"/>
                              <cs typeface="Arial"/>
                          </endParaRPr>
                      </p>
                  </txBody>
              </sp>
          </spTree>
      </sld>
  `).join('');

  // 3. **Generate `[Content_Types].xml`**:
  const contentTypesXML = `
      [Content_Types].xml
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
          <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
          <Default Extension="xml" ContentType="application/xml"/>
          <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
          ${slides.map((_, index) => `<Override PartName="/ppt/slides/slide${index+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('')}
      </Types>
  `;

  // 4. **Generate `presentation.xml`**:
  const presentationXML = `
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <p:presentation xmlns:p="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
          <p:sldIdLst>
              ${slides.map((_, index) => `<p:sldId id="${index+1}" r:id="rId${index+1}"/>`).join('')}
          </p:sldIdLst>
      </p:presentation>
  `;

  // 5. **Generate `/_rels/presentation.xml.rels`**:
  const presentationRelsXML = `
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
          ${slides.map((_, index) => `<Relationship Id="rId${index+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${index+1}.xml"/>`).join('')}
      </Relationships>
  `;

  // **Step-by-Step Explanation**:
  // - Generating necessary XML files for PowerPoint structure.
  // - Using JSZip to create a ZIP archive with the PowerPoint file structure.

  // **Thought Process**:
  // - Given the complexity of fully replicating PowerPoint's features, focusing on a minimal viable product (MVP) approach to demonstrate text-to-PPTX conversion.
  // - Utilizing libraries to simplify ZIP creation and file saving processes.

  // **Final Answer/Action**:
  // - Create the ZIP archive and download it as a `.pptx` file.

  // Create a new JSZip instance
  const zip = new JSZip();

  // Add files to the ZIP
  zip.file('[Content_Types].xml', contentTypesXML);
  zip.file('ppt/presentation.xml', presentationXML);
  zip.file('ppt/_rels/presentation.xml.rels', presentationRelsXML);
  slides.forEach((slide, index) => {
      zip.file(`ppt/slides/slide${index+1}.xml`, pptxXML.split('</sld>')[index] + '</sld>');
  });

  // Generate the ZIP file and trigger download
  zip.generateAsync({type: 'blob'}).then(function(content) {
      saveAs(content, `${fileName}.pptx`);
  });
}

// **Example Usage**:

const textExample = messageParts.map(part => part.content).join(' '); // Concatenate all contents with a space
textToPptx(textExample, 'MyPresentation');
*/

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <img
        src={avatarSrc}
        alt={`${isUser ? 'User' : 'Praiz'} avatar`}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div
        className={`max-w-[70%] rounded-2xl px-6 py-4 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {messageParts.map((part, index) => (
          <div key={index}>
            {part.type === 'code' ? (
              <CodeBlock code={part.content} language={part.language} />
            ) : (
              <ReactMarkdown className="text-sm prose prose-sm max-w-none">
                {part.content}
              </ReactMarkdown>
            )}
          </div>
        ))}
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};