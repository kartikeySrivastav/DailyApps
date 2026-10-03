import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '@dailyapps/theme';
import { AnyDocumentProfile, ResumeProfile, MarriageBiodataProfile } from '../types/resume.types';
import { ShareBottomSheet } from '../components/ShareBottomSheet';
import { ResumeAvatar } from '../components/ResumeAvatar';

interface Props {
  navigation?: any;
  route?: any;
}

export const PdfPreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const document: AnyDocumentProfile = route.params?.document;
  const isBiodata = document?.type === 'marriage_biodata';
  const resume = document?.type === 'resume' ? (document as ResumeProfile) : null;
  const biodata = isBiodata ? (document as MarriageBiodataProfile) : null;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 2;
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const templateId = document?.templateId || (isBiodata ? 'royal_traditional' : 'modern_blue');

  // Candidate Data
  const personName =
    resume?.personalInfo?.fullName ||
    (isBiodata ? biodata?.personalInfo?.fullName || 'Priya Sharma' : 'Rahul Sharma');

  const jobTitle =
    resume?.personalInfo?.jobTitle ||
    (isBiodata ? biodata?.educationAndCareer?.occupation || 'Software Engineer' : 'Senior Frontend Developer');

  const phone =
    resume?.personalInfo?.phone ||
    (isBiodata ? biodata?.contactDetails?.phone1 || '+91 98765 43210' : '+91 98765 43210');

  const email =
    resume?.personalInfo?.email ||
    (isBiodata ? biodata?.contactDetails?.email || 'priya@gmail.com' : 'rahul@gmail.com');

  const location =
    resume?.personalInfo?.location ||
    (isBiodata ? biodata?.personalInfo?.placeOfBirth || 'New Delhi, India' : 'New Delhi, India');

  const linkedin =
    resume?.personalInfo?.linkedin ||
    resume?.socialLinks?.find((s) => s.platform.toLowerCase().includes('linkedin'))?.url ||
    'linkedin.com/in/rahul';

  const photoUri =
    resume?.personalInfo?.photoUri ||
    (isBiodata ? biodata?.personalInfo?.photoUri : undefined);

  const summary =
    resume?.personalInfo?.summary ||
    'Passionate Software Engineer with 3+ years of experience in building modern web applications, scalable design systems, and responsive user interfaces.';

  const experiences =
    resume?.experience && resume.experience.length > 0
      ? resume.experience
      : [
          {
            id: 'exp_1',
            jobTitle: 'Senior Frontend Developer',
            company: 'ABC Tech Solutions',
            location: 'New Delhi',
            startDate: '2021',
            endDate: 'Present',
            highlights: [
              'Architected responsive enterprise web applications using React & TypeScript.',
              'Optimized web vitals and client-side performance, reducing load times by 42%.',
              'Mentored junior engineers and conducted weekly design system reviews.',
            ],
          },
          {
            id: 'exp_2',
            jobTitle: 'Frontend Engineer',
            company: 'Innovate Labs',
            location: 'Bengaluru',
            startDate: '2019',
            endDate: '2021',
            highlights: [
              'Built reusable UI components and collaborated closely with UI/UX team.',
              'Integrated GraphQL and REST APIs with seamless offline state handling.',
            ],
          },
        ];

  const educations =
    resume?.education && resume.education.length > 0
      ? resume.education
      : [
          {
            id: 'edu_1',
            degree: 'B.Tech in Computer Science',
            institution: 'National Institute of Technology',
            startDate: '2015',
            endDate: '2019',
          },
        ];

  const skillsList: string[] =
    resume?.skillCategories?.[0]?.skills && resume.skillCategories[0].skills.length > 0
      ? resume.skillCategories[0].skills
      : ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Redux', 'Node.js', 'Git', 'Tailwind'];

  const projectsList =
    resume?.projects && resume.projects.length > 0
      ? resume.projects
      : [
          {
            id: 'proj_1',
            title: 'Cloud Analytics Dashboard',
            role: 'Lead Developer',
            highlights: ['Real-time metrics dashboard processing 1M+ daily events with 99.9% uptime.'],
          },
        ];

  // Biodata fields
  const bioDob = biodata?.personalInfo?.dateOfBirth || '15 May 1998';
  const bioHeight = biodata?.personalInfo?.height || "5'4\"";
  const bioReligion = biodata?.personalInfo?.religion || 'Hindu';
  const bioCaste = biodata?.personalInfo?.caste || 'Sharma / Brahmin';
  const bioMaritalStatus = biodata?.personalInfo?.maritalStatus || 'Never Married';
  const bioEducationDegree = biodata?.educationAndCareer?.highestEducation || 'B.Tech in Computer Science';
  const bioEducationCollege = biodata?.educationAndCareer?.collegeOrUniversity || 'XYZ University | 2016 – 2020';
  const bioProfessionRole = biodata?.educationAndCareer?.occupation || 'Senior Software Engineer';
  const bioProfessionCompany = biodata?.educationAndCareer?.companyName
    ? `${biodata.educationAndCareer.companyName} | 2020 – Present`
    : 'Tech Solutions Pvt. Ltd. | 2020 – Present';
  const bioIncome = biodata?.educationAndCareer?.annualIncome || '₹18,00,000 PA';
  const bioFather = biodata?.family?.fatherName || 'Rajesh Sharma (Businessman)';
  const bioMother = biodata?.family?.motherName || 'Sunita Sharma (Homemaker)';
  const bioBrother = biodata?.family?.brothersCount || '1 Younger Brother (Studying)';
  const bioSister = biodata?.family?.sistersCount || 'None';
  const bioGotra = biodata?.astrology?.gotra || 'Kashyap';
  const bioRashi = biodata?.astrology?.rashi || 'Vrishabha (Taurus)';
  const bioManglik = biodata?.astrology?.manglik || 'Non-Manglik';

  const handleDownloadPdf = () => {
    navigation.navigate('ExportPdf', { document });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader
        title="PDF Preview"
        subtitle={`${personName} • Page ${currentPage} of ${totalPages}`}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowShareModal(true)}
            style={[styles.headerShareBtn, { backgroundColor: theme.isDark ? '#1E293B' : '#F1F5F9' }]}
          >
            <Text style={{ fontSize: 18 }}>📤</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ============================================================ */}
        {/* MULTI-LAYOUT TEMPLATE RENDERER ACCORDING TO TEMPLATE ID      */}
        {/* ============================================================ */}
        {isBiodata ? (
          templateId === 'modern_clean' || templateId === 'modern_pastel' ? (
            /* Modern Clean Matrimonial Sheet */
            <View style={styles.modernCleanPaper}>
              {currentPage === 1 ? (
                <>
                  <View style={styles.modernBioHeader}>
                    <ResumeAvatar photoUri={photoUri} name={personName} size={70} badgeBorderColor="#D97706" />
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={styles.bioHeaderName}>{personName}</Text>
                      <Text style={[styles.bioHeaderTitle, { color: '#D97706' }]}>{bioProfessionRole}</Text>
                      <Text style={styles.subText}>📍 {location}</Text>
                    </View>
                  </View>

                  <View style={styles.snapshotRow}>
                    <View style={styles.snapshotCol}><Text style={styles.snapH}>DOB</Text><Text style={styles.snapV}>{bioDob}</Text></View>
                    <View style={styles.snapshotCol}><Text style={styles.snapH}>Height</Text><Text style={styles.snapV}>{bioHeight}</Text></View>
                    <View style={styles.snapshotCol}><Text style={styles.snapH}>Community</Text><Text style={styles.snapV}>{bioCaste}</Text></View>
                    <View style={styles.snapshotCol}><Text style={styles.snapH}>Package</Text><Text style={[styles.snapV, { color: '#D97706', fontWeight: '700' }]}>{bioIncome}</Text></View>
                  </View>

                  <View style={styles.bioSectionBox}>
                    <Text style={[styles.bioSecTitle, { color: '#D97706' }]}>EDUCATION & CAREER</Text>
                    <View style={styles.bioDivider} />
                    <Text style={styles.boldText}>{bioEducationDegree}</Text>
                    <Text style={styles.subText}>{bioEducationCollege}</Text>
                    <Text style={[styles.boldText, { marginTop: 6 }]}>{bioProfessionRole}</Text>
                    <Text style={styles.subText}>{bioProfessionCompany}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.bioSectionBox}>
                    <Text style={[styles.bioSecTitle, { color: '#D97706' }]}>PERSONAL & LIFESTYLE</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Marital Status:</Text><Text style={styles.bioGridVal}>{bioMaritalStatus}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Religion & Caste:</Text><Text style={styles.bioGridVal}>{bioReligion} — {bioCaste}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Gotra / Rashi:</Text><Text style={styles.bioGridVal}>{bioGotra} / {bioRashi}</Text></View>
                  </View>

                  <View style={styles.bioSectionBox}>
                    <Text style={[styles.bioSecTitle, { color: '#D97706' }]}>FAMILY BACKGROUND</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Father's Name:</Text><Text style={styles.bioGridVal}>{bioFather}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Mother's Name:</Text><Text style={styles.bioGridVal}>{bioMother}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Siblings:</Text><Text style={styles.bioGridVal}>Brothers: {bioBrother} | Sisters: {bioSister}</Text></View>
                  </View>

                  <View style={styles.bioSectionBox}>
                    <Text style={[styles.bioSecTitle, { color: '#D97706' }]}>CONTACT INFORMATION</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Phone:</Text><Text style={styles.bioGridVal}>{phone}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Email:</Text><Text style={styles.bioGridVal}>{email}</Text></View>
                  </View>
                </>
              )}
            </View>
          ) : templateId === 'elegant_photo' || templateId === 'minimal_gold' ? (
            /* Elegant Photo Matrimonial Sheet */
            <View style={[styles.biodataPaper, { borderColor: '#BE185D' }]}>
              {currentPage === 1 ? (
                <>
                  <View style={styles.photoCenterBanner}>
                    <ResumeAvatar photoUri={photoUri} name={personName} size={84} badgeBorderColor="#BE185D" />
                    <Text style={[styles.bioHeaderName, { marginTop: 6 }]}>{personName}</Text>
                    <Text style={[styles.bioHeaderTitle, { color: '#BE185D' }]}>{bioProfessionRole}</Text>
                  </View>

                  <View style={styles.bioSectionBox}>
                    <Text style={[styles.bioSecTitle, { color: '#BE185D' }]}>CANDIDATE VITALS</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>DOB / Age:</Text><Text style={styles.bioGridVal}>{bioDob}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Height:</Text><Text style={styles.bioGridVal}>{bioHeight}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Highest Degree:</Text><Text style={[styles.bioGridVal, { color: '#BE185D', fontWeight: '700' }]}>{bioEducationDegree}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Annual Package:</Text><Text style={[styles.bioGridVal, { color: '#BE185D', fontWeight: '700' }]}>{bioIncome}</Text></View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.bioSectionBox}>
                    <Text style={[styles.bioSecTitle, { color: '#BE185D' }]}>FAMILY & HERITAGE</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Father:</Text><Text style={styles.bioGridVal}>{bioFather}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Mother:</Text><Text style={styles.bioGridVal}>{bioMother}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Siblings:</Text><Text style={styles.bioGridVal}>{bioBrother}</Text></View>
                  </View>

                  <View style={styles.bioSectionBox}>
                    <Text style={[styles.bioSecTitle, { color: '#BE185D' }]}>CONTACT & RESIDENCE</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Phone:</Text><Text style={styles.bioGridVal}>{phone}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Address:</Text><Text style={styles.bioGridVal}>{location}</Text></View>
                  </View>
                </>
              )}
            </View>
          ) : templateId === 'premium_classic' ? (
            /* Premium Classic Matrimonial Sheet */
            <View style={[styles.biodataPaper, { borderColor: '#1E3A8A' }]}>
              {currentPage === 1 ? (
                <>
                  <View style={[styles.auspiciousRow, { backgroundColor: '#1E3A8A' }]}>
                    <Text style={[styles.ganeshChant, { color: '#FFFFFF' }]}>REGAL MATRIMONIAL ALLIANCE</Text>
                  </View>
                  <View style={styles.bioProfileHeader}>
                    <ResumeAvatar photoUri={photoUri} name={personName} size={70} badgeBorderColor="#D97706" />
                    <Text style={styles.bioHeaderName}>{personName}</Text>
                    <Text style={[styles.bioHeaderTitle, { color: '#1E3A8A' }]}>{bioProfessionRole}</Text>
                  </View>
                  <View style={styles.bioSectionBox}>
                    <Text style={[styles.bioSecTitle, { color: '#1E3A8A' }]}>ASTROLOGICAL & PERSONAL</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Gotra / Rashi:</Text><Text style={styles.bioGridVal}>{bioGotra} / {bioRashi}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Manglik:</Text><Text style={styles.bioGridVal}>{bioManglik}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>DOB & Height:</Text><Text style={styles.bioGridVal}>{bioDob} • {bioHeight}</Text></View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.bioSectionBox}>
                    <Text style={[styles.bioSecTitle, { color: '#1E3A8A' }]}>CAREER & FAMILY LEGACY</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Education:</Text><Text style={styles.bioGridVal}>{bioEducationDegree}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Occupation:</Text><Text style={styles.bioGridVal}>{bioProfessionRole}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Father:</Text><Text style={styles.bioGridVal}>{bioFather}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Contact:</Text><Text style={styles.bioGridVal}>{phone}</Text></View>
                  </View>
                </>
              )}
            </View>
          ) : (
            /* Royal Traditional Vedic Matrimonial Sheet */
            <View style={styles.biodataPaper}>
              {currentPage === 1 ? (
                <>
                  <View style={styles.auspiciousRow}>
                    <Text style={styles.ganeshChant}>卐  ॥ श्री गणेशाय नमः ॥  卐</Text>
                  </View>

                  <View style={styles.bioProfileHeader}>
                    <View style={styles.bioAvatarFrame}>
                      <ResumeAvatar photoUri={photoUri} name={personName} size={74} badgeBorderColor="#B45309" />
                    </View>
                    <Text style={styles.bioHeaderName}>{personName}</Text>
                    <Text style={styles.bioHeaderTitle}>{jobTitle}</Text>
                  </View>

                  <View style={styles.bioSectionBox}>
                    <Text style={styles.bioSecTitle}>PERSONAL DETAILS</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Date of Birth:</Text><Text style={styles.bioGridVal}>{bioDob}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Height:</Text><Text style={styles.bioGridVal}>{bioHeight}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Religion & Caste:</Text><Text style={styles.bioGridVal}>{bioReligion} — {bioCaste}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Gotra / Rashi:</Text><Text style={styles.bioGridVal}>{bioGotra} / {bioRashi}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Marital Status:</Text><Text style={styles.bioGridVal}>{bioMaritalStatus}</Text></View>
                  </View>

                  <View style={styles.bioSectionBox}>
                    <Text style={styles.bioSecTitle}>EDUCATION & PROFESSION</Text>
                    <View style={styles.bioDivider} />
                    <Text style={styles.boldText}>{bioEducationDegree}</Text>
                    <Text style={styles.subText}>{bioEducationCollege}</Text>
                    <Text style={[styles.boldText, { marginTop: 6 }]}>{bioProfessionRole}</Text>
                    <Text style={styles.subText}>{bioProfessionCompany}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.bioSectionBox}>
                    <Text style={styles.bioSecTitle}>FAMILY BACKGROUND</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Father's Name:</Text><Text style={styles.bioGridVal}>{bioFather}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Mother's Name:</Text><Text style={styles.bioGridVal}>{bioMother}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Brother(s):</Text><Text style={styles.bioGridVal}>{bioBrother}</Text></View>
                  </View>

                  <View style={styles.bioSectionBox}>
                    <Text style={styles.bioSecTitle}>CONTACT & ADDRESS</Text>
                    <View style={styles.bioDivider} />
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Phone:</Text><Text style={styles.bioGridVal}>{phone}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Email:</Text><Text style={styles.bioGridVal}>{email}</Text></View>
                    <View style={styles.bioGridRow}><Text style={styles.bioGridLabel}>Address:</Text><Text style={styles.bioGridVal}>{location}</Text></View>
                  </View>
                </>
              )}
            </View>
          )
        ) : templateId === 'clean_minimal' || templateId === 'ats_classic' ? (
          /* ATS Clean Minimal Single Column Sheet */
          <View style={styles.atsPaper}>
            {currentPage === 1 ? (
              <>
                <View style={styles.atsHeader}>
                  <Text style={styles.atsName}>{personName.toUpperCase()}</Text>
                  <Text style={styles.atsJob}>{jobTitle}</Text>
                  <Text style={styles.atsContact}>{location}  •  {phone}  •  {email}  •  {linkedin}</Text>
                  <View style={styles.atsDivider} />
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.atsSecHeading}>SUMMARY</Text>
                  <View style={styles.atsHairline} />
                  <Text style={styles.atsBody}>{summary}</Text>
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.atsSecHeading}>EXPERIENCE</Text>
                  <View style={styles.atsHairline} />
                  {experiences.map((exp: any, idx: number) => (
                    <View key={exp.id || idx} style={{ marginBottom: 8 }}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.boldText}>{exp.jobTitle}</Text>
                        <Text style={styles.subText}>{exp.startDate} – {exp.endDate}</Text>
                      </View>
                      <Text style={styles.italicText}>{exp.company} — {exp.location}</Text>
                      {exp.highlights?.map((h: string, hIdx: number) => (
                        <Text key={hIdx} style={styles.atsBullet}>• {h}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <>
                <View style={styles.paperSec}>
                  <Text style={styles.atsSecHeading}>EDUCATION</Text>
                  <View style={styles.atsHairline} />
                  {educations.map((edu: any, idx: number) => (
                    <View key={edu.id || idx} style={styles.rowBetween}>
                      <View>
                        <Text style={styles.boldText}>{edu.degree}</Text>
                        <Text style={styles.italicText}>{edu.institution}</Text>
                      </View>
                      <Text style={styles.subText}>{edu.startDate} – {edu.endDate}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.atsSecHeading}>TECHNICAL SKILLS & TOOLS</Text>
                  <View style={styles.atsHairline} />
                  <Text style={styles.atsBody}>
                    <Text style={{ fontWeight: '800' }}>Skills: </Text>
                    {skillsList.join(', ')}
                  </Text>
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.atsSecHeading}>PROJECTS</Text>
                  <View style={styles.atsHairline} />
                  {projectsList.map((p: any, idx: number) => (
                    <View key={p.id || idx} style={{ marginBottom: 6 }}>
                      <Text style={styles.boldText}>{p.title}</Text>
                      {p.highlights?.map((h: string, hIdx: number) => (
                        <Text key={hIdx} style={styles.atsBullet}>• {h}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        ) : templateId === 'executive_pro' || templateId === 'executive_slate' ? (
          /* Executive Pro Slate Sheet */
          <View style={styles.execPaper}>
            {currentPage === 1 ? (
              <>
                <View style={styles.execHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.execName}>{personName.toUpperCase()}</Text>
                    <Text style={styles.execJob}>{jobTitle}</Text>
                    <View style={styles.goldLine} />
                    <Text style={styles.execContactText}>📍 {location}  |  ✉ {email}  |  📞 {phone}</Text>
                  </View>
                  <ResumeAvatar photoUri={photoUri} name={personName} size={64} badgeBorderColor="#D97706" />
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.execSecHeading}>EXECUTIVE SUMMARY</Text>
                  <Text style={styles.paperBodyText}>{summary}</Text>
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.execSecHeading}>CORE COMPETENCIES & EXPERTISE</Text>
                  <View style={styles.grid2Col}>
                    {skillsList.map((s, idx) => (
                      <View key={idx} style={styles.competencyRow}>
                        <Text style={{ color: '#D97706', fontWeight: '800', marginRight: 5 }}>✓</Text>
                        <Text style={{ fontSize: 10.5, color: '#1E293B', fontWeight: '600' }}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.paperSec}>
                  <Text style={styles.execSecHeading}>LEADERSHIP EXPERIENCE</Text>
                  {experiences.map((exp: any, idx: number) => (
                    <View key={exp.id || idx} style={{ marginBottom: 8 }}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.boldText}>{exp.jobTitle}</Text>
                        <Text style={styles.subText}>{exp.startDate} – {exp.endDate}</Text>
                      </View>
                      <Text style={styles.subText}>{exp.company} • {exp.location}</Text>
                      {exp.highlights?.map((h: string, hIdx: number) => (
                        <Text key={hIdx} style={styles.atsBullet}>▪ {h}</Text>
                      ))}
                    </View>
                  ))}
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.execSecHeading}>EDUCATION & CREDENTIALS</Text>
                  {educations.map((edu: any, idx: number) => (
                    <View key={edu.id || idx} style={{ marginBottom: 6 }}>
                      <Text style={styles.boldText}>{edu.degree}</Text>
                      <Text style={styles.subText}>{edu.institution}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        ) : templateId === 'creative_bold' || templateId === 'creative_pro' || templateId === 'creative_infographic' ? (
          /* Creative Bold Card Sheet */
          <View style={styles.creativePaper}>
            {currentPage === 1 ? (
              <>
                <View style={styles.creativeTopBanner}>
                  <ResumeAvatar photoUri={photoUri} name={personName} size={66} badgeBorderColor="#DDD6FE" />
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.creativeNameText}>{personName}</Text>
                    <Text style={styles.creativeJobText}>{jobTitle}</Text>
                    <Text style={styles.creativeContactText}>📞 {phone}  |  ✉ {email}</Text>
                  </View>
                </View>

                <View style={styles.creativeCard}>
                  <Text style={styles.creativeSecTitle}>✨ About Me</Text>
                  <Text style={styles.paperBodyText}>{summary}</Text>
                </View>

                <View style={styles.creativeCard}>
                  <Text style={styles.creativeSecTitle}>💼 Experience Timeline</Text>
                  {experiences.map((exp: any, idx: number) => (
                    <View key={exp.id || idx} style={{ marginBottom: 6 }}>
                      <Text style={styles.boldText}>{exp.jobTitle}</Text>
                      <Text style={styles.subText}>{exp.company} • {exp.startDate} – {exp.endDate}</Text>
                      {exp.highlights?.map((h: string, hIdx: number) => (
                        <Text key={hIdx} style={{ fontSize: 10, color: '#334155' }}>▹ {h}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <>
                <View style={styles.creativeCard}>
                  <Text style={styles.creativeSecTitle}>⚡ Key Capabilities</Text>
                  <View style={styles.skillsContainer}>
                    {skillsList.map((skill, index) => (
                      <View key={index} style={styles.purplePill}>
                        <Text style={styles.purplePillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.creativeCard}>
                  <Text style={styles.creativeSecTitle}>🚀 Featured Projects</Text>
                  {projectsList.map((p: any, idx: number) => (
                    <View key={p.id || idx} style={{ marginBottom: 6 }}>
                      <Text style={styles.boldText}>{p.title}</Text>
                      {p.highlights?.map((h: string, hIdx: number) => (
                        <Text key={hIdx} style={{ fontSize: 10, color: '#334155' }}>▹ {h}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        ) : (
          /* Default: Modern Split Sheet with Photo & Blue Accent */
          <View style={styles.modernPaper}>
            <View style={styles.paperTopBar} />

            {currentPage === 1 ? (
              <>
                <View style={styles.paperHeaderRow}>
                  <ResumeAvatar photoUri={photoUri} name={personName} size={68} badgeBorderColor="#2563EB" />
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.paperCandidateName}>{personName}</Text>
                    <Text style={styles.paperCandidateJob}>{jobTitle}</Text>
                    <Text style={styles.paperContactText}>📞 {phone}  |  ✉ {email}</Text>
                    <Text style={styles.paperContactText}>📍 {location}  |  🔗 {linkedin}</Text>
                  </View>
                </View>

                <View style={styles.paperDivider} />

                <View style={styles.paperSec}>
                  <Text style={styles.paperSecHeading}>PROFESSIONAL SUMMARY</Text>
                  <View style={styles.blueBar} />
                  <Text style={styles.paperBodyText}>{summary}</Text>
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.paperSecHeading}>WORK EXPERIENCE</Text>
                  <View style={styles.blueBar} />
                  {experiences.map((exp: any, idx: number) => (
                    <View key={exp.id || idx} style={styles.paperExpBlock}>
                      <Text style={styles.paperExpTitle}>{exp.jobTitle}</Text>
                      <Text style={styles.paperExpCompany}>{exp.company} | {exp.startDate} – {exp.endDate}</Text>
                      {exp.highlights?.map((h: string, hIdx: number) => (
                        <View key={hIdx} style={styles.bulletRow}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.bulletContent}>{h}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <>
                <View style={styles.paperSec}>
                  <Text style={styles.paperSecHeading}>EDUCATION</Text>
                  <View style={styles.blueBar} />
                  {educations.map((edu: any, idx: number) => (
                    <View key={edu.id || idx} style={{ marginBottom: 6 }}>
                      <Text style={styles.boldText}>{edu.degree}</Text>
                      <Text style={styles.subText}>{edu.institution} | {edu.startDate} – {edu.endDate}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.paperSecHeading}>TECHNICAL SKILLS</Text>
                  <View style={styles.blueBar} />
                  <View style={styles.skillsContainer}>
                    {skillsList.map((skill, index) => (
                      <View key={index} style={styles.skillChip}>
                        <Text style={styles.skillChipText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.paperSec}>
                  <Text style={styles.paperSecHeading}>KEY PROJECTS</Text>
                  <View style={styles.blueBar} />
                  {projectsList.map((p: any, idx: number) => (
                    <View key={p.id || idx} style={{ marginBottom: 6 }}>
                      <Text style={styles.boldText}>{p.title}</Text>
                      {p.highlights?.map((h: string, hIdx: number) => (
                        <Text key={hIdx} style={styles.bulletContent}>• {h}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* Page Switcher: [ < 1 / 2 > ] */}
        <View style={styles.paginationRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
          >
            <Text style={[styles.pageArrowText, { color: theme.colors.text }]}>‹</Text>
          </TouchableOpacity>

          <View style={styles.pageBadge}>
            <Text style={[styles.pageBadgeText, { color: theme.colors.text }]}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
          >
            <Text style={[styles.pageArrowText, { color: theme.colors.text }]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Screen 11: Sticky Bottom Download & Share Action Bar */}
      <View
        style={[
          styles.bottomActionBar,
          { backgroundColor: theme.colors.surfaceCard, borderTopColor: theme.colors.border },
        ]}
      >
        <TouchableOpacity activeOpacity={0.85} onPress={handleDownloadPdf} style={styles.downloadBtn}>
          <Text style={styles.downloadBtnText}>⬇ Download PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowShareModal(true)}
          style={[styles.shareBtn, { borderColor: '#2563EB' }]}
        >
          <Text style={styles.shareBtnText}>🔗 Share</Text>
        </TouchableOpacity>
      </View>

      {/* Share Bottom Sheet */}
      <ShareBottomSheet
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        fileName={`${personName.replace(/\s+/g, '_')}_${isBiodata ? 'Biodata' : 'Resume'}.pdf`}
        fileSize="2.4 MB"
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 12,
    paddingBottom: 90,
  },
  headerShareBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  biodataPaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#881337',
    padding: 16,
    minHeight: 460,
    elevation: 3,
  },
  modernCleanPaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    minHeight: 460,
    elevation: 3,
  },
  modernBioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  snapshotRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  snapshotCol: {
    flex: 1,
    alignItems: 'center',
  },
  snapH: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
  },
  snapV: {
    fontSize: 10.5,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 1,
  },
  photoCenterBanner: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FCE7F3',
    marginBottom: 10,
  },
  auspiciousRow: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 8,
    borderRadius: 4,
  },
  ganeshChant: {
    fontSize: 13,
    fontWeight: '800',
    color: '#881337',
    letterSpacing: 1,
  },
  bioProfileHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bioAvatarFrame: {
    marginBottom: 6,
  },
  bioHeaderName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  bioHeaderTitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  bioSectionBox: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 6,
    padding: 8,
  },
  bioSecTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#881337',
    letterSpacing: 0.8,
  },
  bioDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  bioGridRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  bioGridLabel: {
    width: '42%',
    fontSize: 10,
    color: '#64748B',
  },
  bioGridVal: {
    width: '58%',
    fontSize: 10,
    color: '#0F172A',
    fontWeight: '600',
  },
  atsPaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    minHeight: 460,
    elevation: 2,
  },
  atsHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  atsName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.5,
  },
  atsJob: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  atsContact: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 4,
  },
  atsDivider: {
    height: 1,
    backgroundColor: '#0F172A',
    width: '100%',
    marginTop: 8,
  },
  atsSecHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1,
  },
  atsHairline: {
    height: 0.5,
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },
  atsBody: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
  },
  atsBullet: {
    fontSize: 10,
    color: '#334155',
    marginLeft: 6,
    marginTop: 1,
  },
  execPaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    minHeight: 460,
    elevation: 3,
  },
  execHeaderRow: {
    backgroundColor: '#0F172A',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  execName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  execJob: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
    marginTop: 2,
  },
  goldLine: {
    height: 1.5,
    backgroundColor: '#D97706',
    width: 36,
    marginVertical: 4,
  },
  execContactText: {
    fontSize: 9,
    color: '#94A3B8',
  },
  execSecHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 2,
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 3,
  },
  competencyRow: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  creativePaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    overflow: 'hidden',
    minHeight: 460,
    elevation: 3,
  },
  creativeTopBanner: {
    backgroundColor: '#7C3AED',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  creativeNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  creativeJobText: {
    fontSize: 11,
    color: '#E9D5FF',
    marginTop: 2,
  },
  creativeContactText: {
    fontSize: 9,
    color: '#F5F3FF',
    marginTop: 4,
  },
  creativeCard: {
    margin: 10,
    marginBottom: 4,
    padding: 10,
    backgroundColor: '#FAF5FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  creativeSecTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 4,
  },
  purplePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#EDE9FE',
    borderRadius: 99,
  },
  purplePillText: {
    fontSize: 9.5,
    color: '#6D28D9',
    fontWeight: '700',
  },
  modernPaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    minHeight: 460,
    elevation: 3,
  },
  paperTopBar: {
    height: 6,
    backgroundColor: '#2563EB',
  },
  paperHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  paperCandidateName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  paperCandidateJob: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  paperContactText: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
  },
  paperDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  paperSec: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  paperSecHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1,
  },
  blueBar: {
    height: 1.5,
    backgroundColor: '#2563EB',
    width: 28,
    marginVertical: 3,
  },
  paperBodyText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
  },
  paperExpBlock: {
    marginBottom: 6,
  },
  paperExpTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  paperExpCompany: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  boldText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  italicText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#475569',
  },
  subText: {
    fontSize: 10,
    color: '#64748B',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 1,
  },
  bulletDot: {
    fontSize: 10,
    color: '#2563EB',
    marginRight: 4,
  },
  bulletContent: {
    fontSize: 10,
    color: '#334155',
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  skillChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#BFDBFE',
  },
  skillChipText: {
    fontSize: 9.5,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 12,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnDisabled: {
    opacity: 0.35,
  },
  pageArrowText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  pageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  pageBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
    elevation: 8,
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  shareBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    color: '#2563EB',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
