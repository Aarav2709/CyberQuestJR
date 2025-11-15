import React, { useEffect, useState } from 'react';
import { aiAPI } from '../services/api';
import type { AIMetadata } from '../types';

interface Props {
	challengeType?: 'phishing' | 'password' | 'privacy' | string;
	difficulty?: 'beginner' | 'intermediate' | 'advanced';
	topic?: string;
}

const AIGame: React.FC<Props> = ({ challengeType = 'phishing', difficulty = 'beginner', topic = 'general' }) => {
	const [challenge, setChallenge] = useState<any>(null);
	const [selected, setSelected] = useState<string>('');
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [metadata, setMetadata] = useState<AIMetadata | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				setSelected('');
				setResult(null);
				const data = await aiAPI.generateChallenge({ challenge_type: challengeType, difficulty, topic });
				setChallenge(data.challenge);
				setMetadata(data.challenge?.metadata ?? null);
				setError(null);
			} catch (e) {
				console.error(e);
				setError('We could not reach the AI challenge engine. Offline practice missions may be limited.');
				setChallenge(null);
				setMetadata(null);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [challengeType, difficulty, topic]);

	const submit = async () => {
		if (!challenge || !challenge.interactive_elements?.length) return;
		const el = challenge.interactive_elements[0];
		try {
			const res = await aiAPI.submitAnswer({
				challenge_id: challenge.id || 'unknown',
				answer: selected,
				correct_answer: el.correct_answer,
			});
			setResult(res);
		} catch (e) {
			console.error(e);
		}
	};

	if (loading) {
		return <div className="card text-center">Loading AI challenge...</div>;
	}

	if (!challenge) {
		return (
			<div className="card text-center">
				{error || 'No challenge available.'}
			</div>
		);
	}

	const el = challenge.interactive_elements?.[0];

	return (
		<div className="card">
			{metadata && (
				<div
					className={`mb-4 rounded-xl border p-4 text-sm ${
						metadata.ai_enabled
							? 'bg-emerald-50 border-emerald-200 text-emerald-900'
							: 'bg-amber-50 border-amber-200 text-amber-900'
					}`}
				>
					<p className="font-semibold">
						{metadata.ai_enabled ? 'AI-generated challenge' : 'Offline challenge preview'}
					</p>
					{metadata.reason && <p className="text-xs mt-2">{metadata.reason}</p>}
					{metadata.generated_at && (
						<p className="text-[11px] text-gray-600 mt-1">
							Generated {new Date(metadata.generated_at).toLocaleString()} via {metadata.source}
						</p>
					)}
				</div>
			)}
			<div className="mb-4">
				<div className="text-sm text-gray-500">{challenge.type} - {challenge.difficulty}</div>
				<h3 className="text-2xl font-bold">{challenge.title}</h3>
				<p className="text-gray-700">{challenge.description}</p>
			</div>

			{el && (
				<div className="space-y-3 mb-4">
					<div className="font-medium">{el.question}</div>
					{el.options?.map((opt: string, i: number) => (
						<button key={i} onClick={() => setSelected(opt)} className={`w-full text-left p-3 rounded border ${selected === opt ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
							{opt}
						</button>
					))}
				</div>
			)}

			{!result ? (
				<button disabled={!selected} onClick={submit} className={`btn-primary ${!selected ? 'opacity-50 cursor-not-allowed' : ''}`}>Submit</button>
			) : (
				<div className={`p-4 rounded ${result.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
					<div className="font-bold mb-1">{result.correct ? 'Correct!' : 'Not quite.'}</div>
					<div className="text-sm text-gray-700">{result.feedback}</div>
					{el?.explanation && <div className="text-sm text-gray-600 mt-2">Tip: {el.explanation}</div>}
				</div>
			)}
		</div>
	);
};

export default AIGame;
