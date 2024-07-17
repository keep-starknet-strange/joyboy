import {ImagePickerAsset} from 'expo-image-picker';
import {Platform} from 'react-native';

import {ApiInstance} from '../../services/api';
import {dataURLToBlob} from '../../utils/helpers';
import {useApiMutation} from './useApiMutation';

export const useFileUpload = () => {
  return useApiMutation({
    mutationKey: ['fileUpload'],
    mutationFn: (file: ImagePickerAsset) => {
      const formData = new FormData();

      formData.append(
        'file',
        Platform.OS === 'web'
          ? dataURLToBlob(file.uri)
          : ({
              uri: file.uri,
              name: 'file',
              type: file.mimeType,
            } as any),
      );

      return ApiInstance.post('/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });
};
