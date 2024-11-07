import { TextInput } from '@mantine/core';
import { useState } from 'react';
import classes from './FloatingLabels.module.css';


export function TextInputs() {
    const [name, setName] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [email, setEmail] = useState('');
    const [communityLink, setCommunityLink] = useState('');
    const [revenue, setRevenue] = useState('');
    
    const [nameLabelFocused, setNameLabelFocused] = useState(false);
    const [whatsAppLabelFocused, setWhatsAppLabelFocused] = useState(false);
    const [emailLabelFocused, setEmailLabelFocused] = useState(false);
    const [communityLinkLabelFocused, setCommunityLinkLabelFocused] = useState(false);
    const [revenueLabelFocused, setRevenueLabelFocused] = useState(false);

    const nameFloating = name.trim().length !== 0 || nameLabelFocused || undefined;
    const whatsAppFloating = whatsApp.trim().length !== 0 || whatsAppLabelFocused || undefined;
    const emailFloating = email.trim().length !== 0 || emailLabelFocused || undefined;
    const communityLinkFloating = communityLink.trim().length !== 0 || communityLinkLabelFocused || undefined;
    const revenueFloating = revenue.trim().length !== 0 || revenueLabelFocused || undefined;

    return (
        <>
            <TextInput
                label="Your name"
                placeholder="John Doe"
                required
                classNames={classes}
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                onFocus={() => setNameLabelFocused(true)}
                onBlur={() => setNameLabelFocused(false)}
                mt="md"
                autoComplete="nope"
                data-floating={nameFloating}
                labelProps={{ 'data-floating': nameFloating }}
            />
            <TextInput
                label="Your WhatsApp"
                placeholder=""
                required
                classNames={classes}
                value={whatsApp}
                onChange={(event) => setWhatsApp(event.currentTarget.value)}
                onFocus={() => setWhatsAppLabelFocused(true)}
                onBlur={() => setWhatsAppLabelFocused(false)}
                mt="md"
                autoComplete="nope"
                data-floating={whatsAppFloating}
                labelProps={{ 'data-floating': whatsAppFloating }}
            />
            <TextInput
                label="Your email"
                placeholder="hello@mail.com"
                required
                classNames={classes}
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                onFocus={() => setEmailLabelFocused(true)}
                onBlur={() => setEmailLabelFocused(false)}
                mt="md"
                autoComplete="nope"
                data-floating={emailFloating}
                labelProps={{ 'data-floating': emailFloating }}
            />
            <TextInput
                label="Community Link"
                placeholder="https://www.skool.com/community"
                required
                classNames={classes}
                value={communityLink}
                onChange={(event) => setCommunityLink(event.currentTarget.value)}
                onFocus={() => setCommunityLinkLabelFocused(true)}
                onBlur={() => setCommunityLinkLabelFocused(false)}
                mt="md"
                autoComplete="nope"
                data-floating={communityLinkFloating}
                labelProps={{ 'data-floating': communityLinkFloating }}
            />
            <TextInput
                label="Monthly Revenue"
                placeholder="10000"
                required
                classNames={classes}
                value={revenue}
                onChange={(event) => setRevenue(event.currentTarget.value)}
                onFocus={() => setRevenueLabelFocused(true)}
                onBlur={() => setRevenueLabelFocused(false)}
                mt="md"
                autoComplete="nope"
                data-floating={revenueFloating}
                labelProps={{ 'data-floating': revenueFloating }}
            />
        </>
    )
}
