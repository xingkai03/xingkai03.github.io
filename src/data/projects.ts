// Projects shown on the home page (featured: true) and on /projects.
// Each entry is a short case study: problem → what was done → result.

export interface Project {
	title: string;
	context: string;
	summary: string;
	highlights: string[];
	tools: string[];
	links?: { label: string; href: string }[];
	featured?: boolean;
}

export const projects: Project[] = [
	{
		title: 'Automatic sleep staging from EEG, EOG and EMG',
		context: 'Group project · CM2013, KTH · 2026',
		summary:
			'A pipeline that labels every 30-second epoch of an overnight recording as Wake, N1, N2, N3 or REM, using the public Sleep-EDF dataset. It runs in three stages: signal preprocessing, feature extraction and machine learning.',
		highlights: [
			'Subject-wise validation (leave-one-subject-out and grouped k-fold on 68 subjects), so the model is always tested on people it has never seen.',
			"On a three-subject pilot, adding validated spectral features raised Cohen's κ from 0.75 to 0.78 and macro-F1 from 0.65 to 0.68.",
			'Reproducible engineering: locked Python environment, 60+ automated tests and a results log recording every change and why it was kept.',
		],
		tools: ['Python', 'MNE', 'SciPy', 'scikit-learn', 'Signal processing'],
		links: [{ label: 'Code on GitHub', href: 'https://github.com/xingkai03/CM2013_SleepEDF_Group14' }],
		featured: true,
	},
	{
		title: 'Tomographic image reconstruction with parallelproj',
		context: 'Group project · CM2015, KTH · 2026',
		summary:
			'Image reconstruction for medical tomography using parallelproj, a library of fast forward and back projectors. The project also covers the ethical risks of using machine learning in medical imaging.',
		highlights: [
			'Work with projection data and iterative reconstruction.',
			'Ethics seminar on the risks of machine learning in clinical imaging.',
		],
		tools: ['Python', 'parallelproj', 'Image reconstruction'],
		featured: true,
	},
];
