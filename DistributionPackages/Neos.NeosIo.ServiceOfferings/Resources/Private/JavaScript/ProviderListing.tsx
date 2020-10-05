import {h} from 'preact';
import * as React from "preact/compat";
import {useContext, useEffect, useMemo, useState} from "preact/hooks";
import ProviderData from "./Context/ProviderData";
import TranslationData from "./Context/TranslationData";
import ProviderListGridItem from "./Components/ProviderListGridItem";
import ProviderListTableRow from "./Components/ProviderListTableRow";
import {SortDirection, sortObjects} from "./Helper/Sorter";
import CaseStudyGridItem
    from "../../../../Neos.NeosIo.CaseStudies/Resources/Private/JavaScript/Components/CaseStudyGridItem";
import CaseStudyTableRow
    from "../../../../Neos.NeosIo.CaseStudies/Resources/Private/JavaScript/Components/CaseStudyTableRow";

const sizeValueMap = {
    '': 99,
    '1': 1,
    '2-10': 2,
    '11-50': 3,
    '51-100': 4,
    '100+': 5
};

export default function ProviderListing() {
    const providerData: Provider[] = useContext(ProviderData);
    const translationData: string[] = useContext(TranslationData);

    // Filter entries
    const countries: string[] = useMemo(() => providerData.reduce((carry: string[], provider: Provider) => {
        carry.push(provider.country);
        return carry;
    }, []).filter((v, i, a) => v && a.indexOf(v) === i), [providerData]);
    const sizes: string[] = useMemo(() => providerData.reduce((carry: string[], provider: Provider) => {
        carry.push(provider.size);
        return carry;
    }, []).filter((v, i, a) => v && a.indexOf(v) === i), [providerData]);

    // State hooks
    const [searchWord, setSearchWord] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [sizeFilter, setSizeFilter] = useState('');
    const [sorting, setSorting] = useState('');
    const [sortingDirection, setSortingDirection] = useState(SortDirection.Asc);
    const [providers, setProviders] = useState(providerData);
    const [grid, setGrid] = useState(true);

    // Callbacks
    const search = (word: string) => setSearchWord(word.toLowerCase());
    const filterByCountry = (country: string) => setCountryFilter(country);
    const filterBySize = (size: string) => setSizeFilter(size);
    const sortBy = (property: string) => {
        if (property !== sorting) {
            setSortingDirection(SortDirection.Asc);
            setSorting(property);
        } else {
            setSortingDirection(sortingDirection === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc);
        }
    };

    const switchToGrid = (state: boolean) => { setGrid(state)};

    useEffect(() => {
        let filteredProviders = providerData.filter(provider => {
            return (!searchWord || provider.searchText.includes(searchWord))
                && (!countryFilter || provider.country == countryFilter)
                && (!sizeFilter || provider.size == sizeFilter);
        });
        if (sorting) {
            filteredProviders = sortObjects(
                filteredProviders,
                sorting,
                sortingDirection,
                sorting === 'size' ? sizeValueMap : null
            );
        }
        setProviders(filteredProviders);
    }, [searchWord, countryFilter, sizeFilter, sorting, sortingDirection]);

    return (
        <div>
            <div>
                <header class="service-providers__grid-tableview">
                    <div class="service-providers__grid-row remove-border ">
                        <div class="service-providers__grid-cell hide-md-down">
                        </div>
                        <div class="service-providers__header service-providers__grid-cell service-providers__header--sortable hide-md-down"
                             onClick={() => sortBy('title')}>
                            {translationData['name']}&nbsp;<i className={'fas ' + (sorting == 'title' ? (sortingDirection == SortDirection.Asc ? 'fa-sort-down ' : ' fa-sort-up') : 'fa-sort') } />
                        </div>
                        <div class="service-providers__header service-providers__grid-cell service-providers__header--sortable hide-md-down"
                             onClick={() => sortBy('city')}>
                            {translationData['location']}&nbsp;<i className={'fas ' + (sorting == 'city' ? (sortingDirection == SortDirection.Asc ? 'fa-sort-down ' : ' fa-sort-up') : 'fa-sort') } />
                        </div>
                        <div class="service-providers__header service-providers__grid-cell service-providers__header--sortable hide-md-down"
                             onClick={() => sortBy('size')}>
                            {translationData['size']}&nbsp;<i className={'fas ' + (sorting == 'size' ? (sortingDirection == SortDirection.Asc ? 'fa-sort-down ' : ' fa-sort-up') : 'fa-sort') } />
                        </div>
                    </div>
                    <div class="service-providers__grid-row remove-border form form--inline">
                        <div class="service-providers__grid-cell">
                            <div className="form__item">
                                <i className={'grid-switcher fas fa-th-large' + (grid ? ' selected' : '')}
                                   onclick={e => switchToGrid(true)}
                                   title={translationData['gridView']}></i>
                            </div>
                            <div className="form__item">
                                <i className={'grid-switcher fas fa-th-list' + (grid ? '' : ' selected')}
                                   onclick={e => switchToGrid(false)}
                                   title={translationData['tableView']}></i>
                            </div>
                        </div>
                        <div class="service-providers__grid-cell">
                            <div className="form__item">
                                <input type="text"
                                       id="service-provider-search"
                                       placeholder={translationData['search']}
                                       class="textInput"
                                       onkeyup={e => search(e.target['value'])}/>&nbsp;
                                <label for="service-provider-search"><i class="fas fa-search"/></label>
                            </div>
                        </div>
                        <div class="service-providers__grid-cell hide-md-down">
                            <div className="form__item">
                                <select id="redirects-filter-status-code"
                                        class="textInput"
                                        onchange={e => filterByCountry(e.target['value'])}>
                                    <option value="">{translationData['chooseCountry']}</option>
                                    {countries.map(country => <option key={country} value={country}>{country}</option>)}
                                </select>
                            </div>
                        </div>
                        <div class="service-providers__grid-cell hide-md-down">
                            <select id="redirects-filter-size"
                                    class="textInput"
                                    onchange={e => filterBySize(e.target['value'])}>
                                <option value="">{translationData['chooseSize']}</option>
                                {sizes.map(size => <option key={size} value={size}>{size}</option>)}
                            </select>

                        </div>
                    </div>
                </header>
                <section className={grid ? 'service-providers__grid-gridview' : 'service-providers__grid-tableview'}>
                    {providers.length ? providers.map(provider => (grid ? <ProviderListGridItem provider={provider}/> : <ProviderListTableRow provider={provider}/>)) : (
                        <div className="service-providers__grid-row">
                            {translationData['noProvidersFound']}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

