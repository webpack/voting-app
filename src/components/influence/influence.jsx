import React from 'react';
import CurrencyIcon from 'Components/currency-icon/currency-icon';
import './influence-style';

export default props => {
    return props.type === 'normal' ? (
        <section className="influence">
            <h2 className="influence__header">
                Influence&nbsp;&nbsp;
                <CurrencyIcon size="huge" type="influence" />
            </h2>
            <p>
                <em>Influence</em> is a unit of measure based on time you have been a member on GitHub. However, 
                from 2017 on you will recieve one influence per day.
            </p>
        </section>
    ) : (
        <section className="influence">
            <h2 className="influence__header">
                Golden Influence&nbsp;&nbsp;
                <CurrencyIcon size="huge" type="goldenInfluence" />
            </h2>
            <p>
                <em>Golden Influence</em> is equal to 100 <i>normal influence</i>. Golden Influence is obtained 
                by being a backer or sponsor on our&nbsp;
                <a href="https://opencollective.com/webpack">
                    Open Collective page
                </a>.
            </p>
        </section>
    );
};
