'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';

function VerifyEmailContent() {
    const params = useSearchParams();
    const router = useRouter();
    const { request } = useApi();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const id = params.get('id');
        const hash = params.get('hash');
        const expires = params.get('expires');
        const signature = params.get('signature');

        if (!id || !hash) {
            setStatus('error');
            return;
        }

        request(`/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`, {
            method: 'GET'
        })
            .then(() => {
                setStatus('success');
                setTimeout(() => router.push('/settings'), 2000);
            })
            .catch(() => setStatus('error'));
    }, []);

    if (status === 'loading') return <p>Vérification en cours...</p>;
    if (status === 'success') return <p>✅ Email vérifié ! Redirection...</p>;
    return <p>❌ Lien invalide ou expiré.</p>;
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<p>Chargement...</p>}>
            <VerifyEmailContent />
        </Suspense>
    );
}