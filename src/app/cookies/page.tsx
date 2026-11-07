import type { Metadata } from 'next';
import Link from 'next/link';
import { PageLegale } from '@/components/layout/PageLegale';
import { LienGererCookies } from '@/components/ui/BandeauCookies';
import { ACompleter } from '@/components/ui/Demo';

export const metadata: Metadata = {
  title: 'Politique de cookies',
  description: "Ce que le site Paradis des téléphones enregistre sur votre appareil, pourquoi, combien de temps, et comment changer d'avis.",
  alternates: { canonical: '/cookies' },
};

const TRACEURS = [
  { nom: 'paradis:config:…', role: 'Garde la finition, la capacité et la carte SIM choisies sur chaque fiche pendant votre visite.', type: 'Nécessaire', duree: 'La visite (effacé à la fermeture de l’onglet)' },
  { nom: 'paradis:commande', role: 'Garde votre brouillon de commande si vous changez de page.', type: 'Nécessaire', duree: 'La visite' },
  { nom: 'paradis:guide-vus', role: 'Évite de vous montrer deux fois le même conseil.', type: 'Nécessaire', duree: 'La visite' },
  { nom: 'paradis:consentement', role: 'Mémorise votre choix sur les cookies pour ne pas vous le redemander à chaque page.', type: 'Nécessaire', duree: '6 mois' },
  { nom: 'Mesure d’audience', role: 'Compte les pages vues et les clics sur « Réserver » ou « Commander », sans nom ni numéro.', type: 'Avec votre accord', duree: 'Aucun outil installé pour l’instant' },
];

const lien = 'font-semibold text-encre underline decoration-filet underline-offset-4 hover:decoration-accent';

export default function Cookies() {
  return (
    <PageLegale titre={['Politique', 'de cookies']} intro="Ce que le site enregistre sur votre appareil, pourquoi, pour combien de temps, et comment changer d’avis à tout moment."
      sections={[
        {
          t: 'En bref',
          c: <>
            <p>Paradis des téléphones n’utilise <strong className="text-encre">aucun cookie publicitaire</strong> et ne revend aucune donnée. Le site garde seulement ce qui lui sert à fonctionner et, si vous l’acceptez, une mesure d’audience anonyme.</p>
            <p>Les formulaires (rendez-vous, inscription, contact) n’enregistrent rien : ils préparent un message que vous choisissez d’envoyer, ou non, par WhatsApp.</p>
          </>,
        },
        {
          t: 'Ce qui est enregistré',
          c: <>
            <p>Un « cookie » ou « traceur » est une petite information gardée par votre navigateur. Voici la liste complète pour ce site&nbsp;:</p>
            <div className="-mx-1 overflow-x-auto">
              <table className="mt-2 w-full min-w-[34rem] border-collapse text-left text-[0.9rem]">
                <thead>
                  <tr className="border-b border-encre text-encre">
                    <th scope="col" className="py-3 pr-4 font-semibold">Nom</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">À quoi il sert</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Type</th>
                    <th scope="col" className="py-3 font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  {TRACEURS.map((t) => (
                    <tr key={t.nom} className="border-b border-filet align-top">
                      <td className="py-3 pr-4 font-mono text-[0.82rem] text-encre">{t.nom}</td>
                      <td className="py-3 pr-4">{t.role}</td>
                      <td className="whitespace-nowrap py-3 pr-4">{t.type}</td>
                      <td className="py-3">{t.duree}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>,
        },
        {
          t: 'Votre choix',
          c: <>
            <p>À votre première visite, un bandeau vous laisse <strong className="text-encre">accepter, refuser ou choisir</strong>. Refuser n’empêche pas d’utiliser le site : la boutique, les rendez-vous et les formations restent accessibles.</p>
            <p>Votre choix est gardé 6 mois, puis redemandé. Vous pouvez le modifier à tout moment&nbsp;: <LienGererCookies className={lien} />.</p>
          </>,
        },
        {
          t: 'Supprimer ces informations',
          c: <p>Vous pouvez aussi effacer les données du site depuis les réglages de votre navigateur (rubrique « Confidentialité » ou « Données de sites »). Votre sélection de produits sera alors vidée.</p>,
        },
        {
          t: 'Services extérieurs',
          c: <p>Le bouton WhatsApp ouvre l’application WhatsApp (Meta) : ce que vous y envoyez relève de la politique de confidentialité de WhatsApp. Les vidéos, cartes ou réseaux sociaux qui seraient ajoutés plus tard ne se chargeront qu’avec votre accord.</p>,
        },
        {
          t: 'Cadre et contact',
          c: <>
            <p>Cette politique suit les principes de la protection des données personnelles applicable au Burkina Faso (loi n°&nbsp;001-2021/AN, contrôlée par la CIL) et, pour les visiteurs européens, le RGPD.</p>
            <p>Pour toute question&nbsp;: <ACompleter>adresse e-mail de Paradis des téléphones</ACompleter>, ou depuis la page <Link href="/boutique" className={lien}>La boutique</Link>. Voir aussi la <Link href="/confidentialite" className={lien}>politique de confidentialité</Link>.</p>
            <p className="text-[0.85rem]">Dernière mise à jour : 6 novembre 2026.</p>
          </>,
        },
      ]} />
  );
}
