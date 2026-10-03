import { AnyDocumentProfile, MarriageBiodataProfile, ResumeProfile, CoverLetterProfile } from '../types/resume.types';

export const ACCENT_PALETTES = [
  { name: 'Royal Maroon', value: '#881337', secondary: '#fff1f2' },
  { name: 'Imperial Gold / Amber', value: '#b45309', secondary: '#fef3c7' },
  { name: 'Regal Navy', value: '#1e3a8a', secondary: '#eff6ff' },
  { name: 'Emerald Green', value: '#065f46', secondary: '#ecfdf5' },
  { name: 'Deep Indigo', value: '#3730a3', secondary: '#eef2ff' },
  { name: 'Slate Charcoal', value: '#334155', secondary: '#f1f5f9' },
  { name: 'Rose Crimson', value: '#9d174d', secondary: '#fdf2f8' },
];

export function generateDocumentHtml(doc: AnyDocumentProfile): string {
  if (doc.type === 'marriage_biodata') {
    return generateMarriageBiodataHtml(doc as MarriageBiodataProfile);
  } else if (doc.type === 'resume') {
    return generateResumeHtml(doc as ResumeProfile);
  } else {
    return generateCoverLetterHtml(doc as CoverLetterProfile);
  }
}

export const generateDocumentPrintableHtml = generateDocumentHtml;

// ---------------------------------------------------------------------------
// Marriage Biodata HTML Generator
// ---------------------------------------------------------------------------
function generateMarriageBiodataHtml(bio: MarriageBiodataProfile): string {
  const accent = bio.accentColor || '#881337';
  const isModern = bio.templateId === 'modern_clean' || bio.templateId === 'modern_pastel';
  const symbolIcon =
    bio.headerSymbol === 'ganesh'
      ? '🕉️'
      : bio.headerSymbol === 'om'
      ? 'ॐ'
      : bio.headerSymbol === 'swastik'
      ? '卐'
      : bio.headerSymbol === 'shree'
      ? '॥ श्री ॥'
      : '';

  return `
<!DOCTYPE html>
<html lang="${bio.language || 'en'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${bio.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      padding: 24px;
      line-height: 1.5;
    }
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 3px double ${accent};
      outline: 1px solid ${accent}40;
      outline-offset: 6px;
      border-radius: 8px;
      padding: 36px 44px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
    }
    .header-banner {
      text-align: center;
      padding-bottom: 20px;
      margin-bottom: 24px;
      border-bottom: 2px solid ${accent}30;
    }
    .auspicious-symbol {
      font-size: 32px;
      color: ${accent};
      line-height: 1;
      margin-bottom: 6px;
    }
    .auspicious-shloka {
      font-size: 18px;
      font-weight: 700;
      color: ${accent};
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .candidate-name {
      font-family: 'Cinzel', serif;
      font-size: 30px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .subtitle-badge {
      display: inline-block;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: ${accent};
      background: ${accent}15;
      padding: 4px 14px;
      border-radius: 9999px;
    }

    .section-title {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: ${accent};
      background: ${accent}10;
      padding: 6px 14px;
      border-left: 4px solid ${accent};
      margin: 22px 0 12px 0;
      border-radius: 0 4px 4px 0;
      page-break-after: avoid;
      break-after: avoid;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 4px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .data-table td {
      padding: 7px 10px;
      font-size: 14px;
      vertical-align: top;
      border-bottom: 1px solid #f1f5f9;
    }
    .data-table td.label {
      width: 38%;
      color: #64748b;
      font-weight: 500;
    }
    .data-table td.value {
      width: 62%;
      color: #0f172a;
      font-weight: 600;
    }
    .highlight-val {
      color: ${accent};
      font-weight: 700;
    }

    .contact-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 18px;
      margin-top: 10px;
    }
    .expectations-box {
      font-style: italic;
      color: #334155;
      background: #fffbeb;
      border-left: 3px solid #f59e0b;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      font-size: 13.5px;
      margin-top: 8px;
    }
    .footer-note {
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px dashed #cbd5e1;
    }

    @media print {
      body {
        padding: 0;
        background: transparent;
      }
      .page-container {
        box-shadow: none;
        border: 2px solid ${accent};
        outline: none;
        padding: 24px 32px;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="header-banner">
      ${!isModern && symbolIcon ? `<div class="auspicious-symbol">${symbolIcon}</div>` : ''}
      ${!isModern ? `<div class="auspicious-shloka">${bio.headerText || '॥ श्री गणेशाय नमः ॥'}</div>` : ''}
      ${
        bio.personalInfo.photoUri &&
        (bio.personalInfo.photoUri.startsWith('http') ||
          bio.personalInfo.photoUri.startsWith('data:') ||
          bio.personalInfo.photoUri.startsWith('file:'))
          ? `<div style="margin: 10px auto 14px auto; text-align: center;">
              <img src="${bio.personalInfo.photoUri}" alt="${bio.personalInfo.fullName}" style="width: 100px; height: 120px; object-fit: cover; border-radius: 8px; border: 3px solid ${accent}; box-shadow: 0 4px 12px rgba(0,0,0,0.12);" />
            </div>`
          : ''
      }
      <h1 class="candidate-name">${bio.personalInfo.fullName}</h1>
      <span class="subtitle-badge">${isModern ? 'MATRIMONIAL PROFILE' : 'विवाह बायोडाटा / Matrimonial Profile'}</span>
    </div>

    <!-- Personal & Horoscope Information -->
    <div class="section-title">Personal & Physical Details</div>
    <table class="data-table">
      <tr>
        <td class="label">Date of Birth</td>
        <td class="value">${bio.personalInfo.dateOfBirth || '-'}</td>
      </tr>
      <tr>
        <td class="label">Time of Birth</td>
        <td class="value">${bio.personalInfo.timeOfBirth || '-'}</td>
      </tr>
      <tr>
        <td class="label">Place of Birth</td>
        <td class="value">${bio.personalInfo.placeOfBirth || '-'}</td>
      </tr>
      <tr>
        <td class="label">Height & Weight</td>
        <td class="value">${bio.personalInfo.height || '-'}${bio.personalInfo.weight ? ` / ${bio.personalInfo.weight}` : ''}</td>
      </tr>
      <tr>
        <td class="label">Complexion</td>
        <td class="value">${bio.personalInfo.complexion || '-'}</td>
      </tr>
      <tr>
        <td class="label">Religion / Community</td>
        <td class="value">${bio.personalInfo.religion} - ${bio.personalInfo.caste}${bio.personalInfo.subCaste ? ` (${bio.personalInfo.subCaste})` : ''}</td>
      </tr>
      <tr>
        <td class="label">Mother Tongue</td>
        <td class="value">${bio.personalInfo.motherTongue || 'Hindi'}</td>
      </tr>
      <tr>
        <td class="label">Marital Status</td>
        <td class="value">${bio.personalInfo.maritalStatus}</td>
      </tr>
    </table>

    <!-- Horoscope / Kundali Details -->
    <div class="section-title">Astrological / Kundali Details</div>
    <table class="data-table">
      <tr>
        <td class="label">Gotra (गोत्र)</td>
        <td class="value highlight-val">${bio.astrology.gotra || 'Bharadwaj'}</td>
      </tr>
      <tr>
        <td class="label">Rashi (राशि) / Nakshatra</td>
        <td class="value">${bio.astrology.rashi || '-'} / ${bio.astrology.nakshatra || '-'}</td>
      </tr>
      <tr>
        <td class="label">Manglik Status (मांगलिक)</td>
        <td class="value highlight-val">${bio.astrology.manglik || 'No'}</td>
      </tr>
      <tr>
        <td class="label">Gan / Nadi / Charan</td>
        <td class="value">${bio.astrology.gan || '-'} / ${bio.astrology.nadi || '-'} / ${bio.astrology.charan || '-'}</td>
      </tr>
    </table>

    <!-- Education & Profession -->
    <div class="section-title">Education & Career</div>
    <table class="data-table">
      <tr>
        <td class="label">Highest Qualification</td>
        <td class="value highlight-val">${bio.educationAndCareer.highestEducation || '-'}</td>
      </tr>
      <tr>
        <td class="label">College / University</td>
        <td class="value">${bio.educationAndCareer.collegeOrUniversity || '-'}</td>
      </tr>
      <tr>
        <td class="label">Occupation / Profession</td>
        <td class="value highlight-val">${bio.educationAndCareer.occupation || '-'}</td>
      </tr>
      <tr>
        <td class="label">Company / Organization</td>
        <td class="value">${bio.educationAndCareer.companyName || '-'}</td>
      </tr>
      <tr>
        <td class="label">Work Location</td>
        <td class="value">${bio.educationAndCareer.jobLocation || '-'}</td>
      </tr>
      <tr>
        <td class="label">Annual Income (CTC)</td>
        <td class="value highlight-val">${bio.educationAndCareer.annualIncome || '-'}</td>
      </tr>
    </table>

    <!-- Family Details -->
    <div class="section-title">Family Background</div>
    <table class="data-table">
      <tr>
        <td class="label">Father's Name & Occupation</td>
        <td class="value">${bio.family.fatherName || '-'} (${bio.family.fatherOccupation || '-'})</td>
      </tr>
      <tr>
        <td class="label">Mother's Name & Occupation</td>
        <td class="value">${bio.family.motherName || '-'} (${bio.family.motherOccupation || '-'})</td>
      </tr>
      <tr>
        <td class="label">Brothers</td>
        <td class="value">${bio.family.brothersCount || 'None'} ${bio.family.marriedBrothers ? `— ${bio.family.marriedBrothers}` : ''}</td>
      </tr>
      <tr>
        <td class="label">Sisters</td>
        <td class="value">${bio.family.sistersCount || 'None'} ${bio.family.marriedSisters ? `— ${bio.family.marriedSisters}` : ''}</td>
      </tr>
      <tr>
        <td class="label">Family Type / Values</td>
        <td class="value">${bio.family.familyType} Family (${bio.family.familyValues})</td>
      </tr>
      <tr>
        <td class="label">Native Place / Ancestral Town</td>
        <td class="value">${bio.family.nativePlace || '-'}</td>
      </tr>
    </table>

    <!-- Partner Expectations -->
    ${
      bio.partnerExpectations
        ? `
    <div class="section-title">Partner Preferences</div>
    <div class="expectations-box">${bio.partnerExpectations}</div>
    `
        : ''
    }

    <!-- Contact Details -->
    <div class="section-title">Contact & Communication</div>
    <div class="contact-card">
      <table class="data-table">
        <tr>
          <td class="label">Contact Person</td>
          <td class="value">${bio.contactDetails.contactPerson || '-'}</td>
        </tr>
        <tr>
          <td class="label">Phone Numbers</td>
          <td class="value highlight-val">${bio.contactDetails.phone1 || '-'}${bio.contactDetails.phone2 ? ` / ${bio.contactDetails.phone2}` : ''}</td>
        </tr>
        ${bio.contactDetails.email ? `<tr><td class="label">Email</td><td class="value">${bio.contactDetails.email}</td></tr>` : ''}
        <tr>
          <td class="label">Residence Address</td>
          <td class="value">${bio.contactDetails.residenceAddress || '-'}</td>
        </tr>
      </table>
    </div>

    <div class="footer-note">Confidential Document — For Matrimonial Alliance Consideration Only</div>
  </div>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Resume HTML Generator
// ---------------------------------------------------------------------------
function generateResumeHtml(resume: ResumeProfile): string {
  const accent = resume.accentColor || '#0284c7';
  const isExecutive = resume.templateId === 'executive_slate' || resume.templateId === 'executive_pro';

  return `
<!DOCTYPE html>
<html lang="${resume.language || 'en'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${resume.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    @page {
      size: A4;
      margin: 12mm 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      padding: 24px;
      line-height: 1.5;
    }
    .page-container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px 48px;
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .header {
      border-bottom: 2px solid ${isExecutive ? accent : '#e2e8f0'};
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .header .job-title {
      font-size: 16px;
      font-weight: 600;
      color: ${accent};
      margin-top: 2px;
    }
    .contact-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 10px;
      font-size: 13px;
      color: #475569;
    }
    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .summary-text {
      font-size: 13.5px;
      color: #334155;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .section-heading {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: ${accent};
      border-bottom: 1.5px solid ${accent}30;
      padding-bottom: 4px;
      margin: 22px 0 12px 0;
      page-break-after: avoid;
      break-after: avoid;
    }
    .entry-item {
      margin-bottom: 14px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 14px;
    }
    .entry-title {
      font-weight: 700;
      color: #0f172a;
    }
    .entry-subtitle {
      font-weight: 600;
      color: #475569;
    }
    .entry-dates {
      font-size: 12.5px;
      color: #64748b;
      font-weight: 500;
    }
    .bullet-list {
      margin: 6px 0 0 16px;
      font-size: 13px;
      color: #334155;
    }
    .bullet-list li {
      margin-bottom: 4px;
      line-height: 1.5;
    }
    .skill-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .skill-pill {
      background: ${accent}15;
      color: ${accent};
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 12.5px;
      font-weight: 500;
    }
    @media print {
      body {
        padding: 0;
        background: transparent;
      }
      .page-container {
        box-shadow: none;
        padding: 24px 32px;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="header" style="display: flex; align-items: center; justify-content: space-between; gap: 20px;">
      <div style="flex: 1;">
        <h1>${resume.personalInfo.fullName}</h1>
        <div class="job-title">${resume.personalInfo.jobTitle}</div>
        <div class="contact-bar">
          <span>📧 ${resume.personalInfo.email}</span>
          <span>📱 ${resume.personalInfo.phone}</span>
          <span>📍 ${resume.personalInfo.location}</span>
          ${resume.personalInfo.linkedin ? `<span>🔗 ${resume.personalInfo.linkedin}</span>` : ''}
          ${resume.personalInfo.githubOrPortfolio ? `<span>💻 ${resume.personalInfo.githubOrPortfolio}</span>` : ''}
        </div>
      </div>
      ${
        resume.personalInfo.photoUri &&
        (resume.personalInfo.photoUri.startsWith('http') ||
          resume.personalInfo.photoUri.startsWith('data:') ||
          resume.personalInfo.photoUri.startsWith('file:'))
          ? `<img src="${resume.personalInfo.photoUri}" alt="${resume.personalInfo.fullName}" style="width: 76px; height: 76px; border-radius: 38px; object-fit: cover; border: 2.5px solid ${accent}; flex-shrink: 0;" />`
          : ''
      }
    </div>

    ${
      resume.personalInfo.summary
        ? `
    <div class="section-heading">Professional Summary</div>
    <div class="summary-text">${resume.personalInfo.summary}</div>
    `
        : ''
    }

    ${
      resume.experience && resume.experience.length > 0
        ? `
    <div class="section-heading">Professional Experience</div>
    ${resume.experience
      .map(
        (exp) => `
      <div class="entry-item">
        <div class="entry-header">
          <span class="entry-title">${exp.jobTitle} <span class="entry-subtitle">— ${exp.company}, ${exp.location}</span></span>
          <span class="entry-dates">${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}</span>
        </div>
        ${exp.description ? `<p style="font-size:13px; color:#475569; margin-top:2px;">${exp.description}</p>` : ''}
        ${
          exp.highlights && exp.highlights.length > 0
            ? `
          <ul class="bullet-list">
            ${exp.highlights.map((h) => `<li>${h}</li>`).join('')}
          </ul>
        `
            : ''
        }
      </div>
    `
      )
      .join('')}
    `
        : ''
    }

    ${
      resume.education && resume.education.length > 0
        ? `
    <div class="section-heading">Education</div>
    ${resume.education
      .map(
        (edu) => `
      <div class="entry-item">
        <div class="entry-header">
          <span class="entry-title">${edu.degree}</span>
          <span class="entry-dates">${edu.startDate} - ${edu.endDate}</span>
        </div>
        <div style="font-size:13px; color:#475569;">${edu.institution}, ${edu.location} ${edu.scoreOrGpa ? `• <strong style="color:${accent}">${edu.scoreOrGpa}</strong>` : ''}</div>
      </div>
    `
      )
      .join('')}
    `
        : ''
    }

    ${
      resume.skillCategories && resume.skillCategories.length > 0
        ? `
    <div class="section-heading">Skills & Technologies</div>
    ${resume.skillCategories
      .map(
        (cat) => `
      <div style="margin-bottom:8px;">
        <strong style="font-size:13px; color:#0f172a;">${cat.categoryName}: </strong>
        <span style="font-size:13px; color:#334155;">${cat.skills.join(', ')}</span>
      </div>
    `
      )
      .join('')}
    `
        : ''
    }

    ${
      resume.projects && resume.projects.length > 0
        ? `
    <div class="section-heading">Key Projects</div>
    ${resume.projects
      .map(
        (proj) => `
      <div class="entry-item">
        <div class="entry-header">
          <span class="entry-title">${proj.title} ${proj.link ? `<small style="font-weight:normal; color:${accent}">(${proj.link})</small>` : ''}</span>
          <span class="entry-dates" style="font-size:12px; font-weight:600; color:${accent}">${proj.techStack}</span>
        </div>
        <p style="font-size:13px; color:#334155; margin-top:2px;">${proj.description}</p>
      </div>
    `
      )
      .join('')}
    `
        : ''
    }

    ${
      resume.certifications && resume.certifications.length > 0
        ? `
    <div class="section-heading">Certifications & Honors</div>
    <ul class="bullet-list">
      ${resume.certifications.map((c) => `<li><strong>${c.name}</strong> — ${c.issuer} (${c.year})</li>`).join('')}
    </ul>
    `
        : ''
    }
  </div>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Cover Letter HTML Generator
// ---------------------------------------------------------------------------
function generateCoverLetterHtml(letter: CoverLetterProfile): string {
  const accent = letter.accentColor || '#1d4ed8';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${letter.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      color: #1e293b;
      padding: 24px;
      line-height: 1.6;
    }
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px 56px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .header {
      border-bottom: 2px solid ${accent};
      padding-bottom: 16px;
      margin-bottom: 28px;
    }
    .sender-name {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
    }
    .sender-title {
      font-size: 15px;
      color: ${accent};
      font-weight: 600;
    }
    .meta-line {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    .date-line {
      margin-top: 20px;
      font-size: 14px;
      font-weight: 500;
      color: #475569;
    }
    .recipient-block {
      margin-top: 16px;
      font-size: 14px;
      color: #334155;
      line-height: 1.5;
    }
    .salutation {
      margin-top: 24px;
      font-weight: 600;
      font-size: 15px;
      color: #0f172a;
    }
    .paragraph {
      margin-top: 16px;
      font-size: 14.5px;
      color: #334155;
      text-align: justify;
    }
    .signoff {
      margin-top: 32px;
      font-size: 15px;
    }
    .signoff-name {
      font-weight: 700;
      margin-top: 36px;
      font-size: 16px;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="header">
      <div class="sender-name">${letter.sender.name}</div>
      <div class="sender-title">${letter.sender.title}</div>
      <div class="meta-line">${letter.sender.email} | ${letter.sender.phone} | ${letter.sender.location}</div>
    </div>

    <div class="date-line">${letter.date}</div>

    <div class="recipient-block">
      <strong>${letter.recipient.hiringManager}</strong><br/>
      ${letter.recipient.department ? `${letter.recipient.department}<br/>` : ''}
      ${letter.recipient.company}<br/>
      ${letter.recipient.location}
    </div>

    <div class="salutation">${letter.salutation}</div>

    <div class="paragraph">${letter.openingParagraph}</div>
    <div class="paragraph">${letter.bodyParagraph}</div>
    <div class="paragraph">${letter.closingParagraph}</div>

    <div class="signoff">
      ${letter.signOff}
      <div class="signoff-name">${letter.sender.name}</div>
    </div>
  </div>
</body>
</html>
`;
}
