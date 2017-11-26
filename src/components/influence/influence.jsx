import React from 'react';
import CurrencyIcon from 'Components/currency-icon/currency-icon';
import './influence-style';

// Specify BEM block name
const block = 'influence';

export default props => {
    return props.type === 'normal' ? (
        <section className={ block }>
            <h2 className={ `${block}__header` }>
                Influence&nbsp;&nbsp;
                <CurrencyIcon size="huge" type="influence" />
            </h2>
            <p className={ `${block}__description` }>
                <em>Influence</em> is a unit of measure based on time you have been a member on GitHub. However, 
                from 2017 on you will recieve one influence per day.
            </p>
        </section>
    ) : (
        <section className={ block }>
            <h2 className={ `${block}__header` }>
                Golden Influence&nbsp;&nbsp;
                <CurrencyIcon size="huge" type="goldenInfluence" />
            </h2>
            <p className={ `${block}__description` }>
                <em>Golden Influence</em> is equal to 100 <i>normal influence</i>. Golden Influence is obtained 
                by being a backer or sponsor on our&nbsp;
                <a href="https://opencollective.com/webpack">
                    Open Collective page
                </a>.
            </p>
        </section>
    );
};
