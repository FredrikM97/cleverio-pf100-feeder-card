import { html, fixture, expect } from '@open-wc/testing';
import '../src/cleverio/card-editor';
import { CleverioCardEditor } from '../src/cleverio/card-editor';
import { describe, it } from 'vitest';

describe('CleverioCardEditor', () => {
  it('renders and updates config', async () => {
    const el = await fixture<CleverioCardEditor>(html`<cleverio-card-editor></cleverio-card-editor>`);
    await el.updateComplete;
    el.setConfig({ sensor: 'sensor.test', title: 'Test' });
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('Test');
  });

  it('renders inputs and updates config via UI', async () => {
    const el = await fixture<CleverioCardEditor>(html`<cleverio-card-editor></cleverio-card-editor>`);
    await customElements.whenDefined('cleverio-card-editor');
    await el.updateComplete;
    const shadow = el.shadowRoot!;
    expect(shadow).to.exist;
    const inputs = shadow.querySelectorAll('input');
    expect(inputs.length).to.equal(2);
    (inputs[0] as HTMLInputElement).value = 'sensor.test';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    (inputs[1] as HTMLInputElement).value = 'My Title';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('My Title');
  });
});
