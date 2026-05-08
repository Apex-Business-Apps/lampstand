import { describe, it, expect } from 'vitest';
import { Prompts } from '../lib/agent/Prompts';

describe('Prompts Constants', () => {
  it('should have all required mode keys', () => {
    expect(Prompts).toHaveProperty('style');
    expect(Prompts).toHaveProperty('guidance');
    expect(Prompts).toHaveProperty('daily');
    expect(Prompts).toHaveProperty('sermon');
    expect(Prompts).toHaveProperty('kids');
  });

  describe('style prompt', () => {
    it('should contain essential writing rules', () => {
      expect(Prompts.style).toContain('Never use em dashes');
      expect(Prompts.style).toContain('No AI filler');
      expect(Prompts.style).toContain('Do not use the words "journey" or "walk"');
      expect(Prompts.style).toContain('60 to 90 words');
    });

    it('should define Lampstand character', () => {
      expect(Prompts.style).toContain('You are Lampstand');
      expect(Prompts.style).toContain('pastoral companion');
    });
  });

  describe('guidance prompt', () => {
    it('should contain guidance mode instructions', () => {
      expect(Prompts.guidance).toContain('Guidance Mode');
      expect(Prompts.guidance).toContain('prayer');
      expect(Prompts.guidance).toContain('30 to 40 words');
    });
  });

  describe('daily prompt', () => {
    it('should contain daily light mode instructions', () => {
      expect(Prompts.daily).toContain('Daily Light Mode');
      expect(Prompts.daily).toContain('prayer');
      expect(Prompts.daily).toContain('25 to 35 words');
    });
  });

  describe('sermon prompt', () => {
    it('should contain sermon mode instructions', () => {
      expect(Prompts.sermon).toContain('Sermon Mode');
      expect(Prompts.sermon).toContain('200 to 280 words');
    });
  });

  describe('kids prompt', () => {
    it('should contain kids mode instructions', () => {
      expect(Prompts.kids).toContain('Kids Mode');
      expect(Prompts.kids).toContain('prayer');
      expect(Prompts.kids).toContain('Simple words');
    });
  });
});
