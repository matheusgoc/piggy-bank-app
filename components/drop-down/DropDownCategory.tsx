import React, { useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import CategoriesServiceApi from '../../services/CategoriesServiceApi';
import DropDownOverlay from './DropDownOverlay';
import { FormikProps } from 'formik';

export interface DropDownCategoryProps {
  formik: FormikProps<any>,
}

const DropDownCategory = (props: DropDownCategoryProps) => {

  const categoryApi = new CategoriesServiceApi();
  const defaultCategoriesList = categoryApi.get();

  const [categories, setCategories] = useState(defaultCategoriesList);
  const [searchingCategory, setSearchingCategory] = useState(false);

  const searchCategories = (name: string):void => {

    name = name.trim();

    if (!name) {

      setCategories(defaultCategoriesList);

    } else {

      setSearchingCategory(true);

      categoryApi.search(name).then((categoriesList) => {

        const sameCategoryIndex = categoriesList.findIndex(category => category.name === name);
        if (sameCategoryIndex < 0) {
          categoriesList.unshift({id: null, name, isNew: true});
        }

        setCategories(categoriesList);

      }).catch(() => {
        setCategories([]);
      }).finally(() => {
        setSearchingCategory(false);
      });
    }
  }
  const searchCategoriesDebounce = AwesomeDebouncePromise(searchCategories, 500);

  return (
    <DropDownOverlay
      name='category'
      formik={props.formik}
      label='* Category'
      items={categories}
      key='id'
      searchKey='name'
      placeholder='Search...'
      width='100%'
      onSearch={searchCategoriesDebounce}
      onOpen={() => searchCategories(props.formik.values.category.name)}
      loading={searchingCategory}
    />
  )
}

export default DropDownCategory