import {h} from 'preact';
import * as React from "preact/compat";

export default function ProviderListEntry({provider}: { provider: Provider }) {
    return (
        <div key={provider.identifier} className="service-providers__grid-row">
            <div className="service-providers__grid-cell service-providers__list-entry__logo hide-md-down">
                <a href={provider.url} title={provider.title}>
                    {provider.logo
                        ? <img src={provider.logo} alt={provider.title} class="service-providers__grid-logo"/>
                        : ''
                    }
                </a>
            </div>
            <div className="service-providers__grid-cell service-providers__list-entry__description">
                <a href={provider.url} title={provider.title}>
                    {provider.title}
                </a>
            </div>
            <div className="service-providers__grid-cell service-providers__list-entry__location">
                {provider.city ? (
                    <address>{provider.city}, {provider.country}</address>
                ) : 'N/A'}
                <i class="fas fa-user-friends"></i> {provider.size ? provider.size : 'N/A'}
            </div>
            {provider.badges && (
                <div className="service-providers__grid-cell service-providers__list-entry__badge">
                    {provider.badges.map((item) =>
                        <img src={item} alt="" class="service-providers__badge"/>
                    )}
                </div>
            )}
        </div>
    )
}
