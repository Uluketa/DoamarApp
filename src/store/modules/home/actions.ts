import { createAction } from '@reduxjs/toolkit';
import { Institution } from '~/types/entities/Institution';
import { SocialIssue } from '~/types/entities/SocialIssue';

export const setHomeData = createAction<{
  institutions?: Institution[];
  socialIssues?: SocialIssue[];
}>('home/setHomeData');
export const setHomeLoading = createAction<boolean>('home/setHomeLoading');
export const clearHome = createAction('home/clearHome');
